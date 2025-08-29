import Cookies from "js-cookie";
import { useUserStoreHook } from "@/store/modules/user";
import { storageLocal, isString, isIncludeAllChildren } from "@pureadmin/utils";
export interface DataInfo<T> {
  /** 用户名 */
  userName?: string;
  /** 昵称 */
  nickName?: string;
  /** 头像 */
  avatar?: string;
  /** 当前登录用户的角色 */
  roles?: Array<simpleAuthority>;
  /** 当前选择的角色 */
  selectRole?: string;
  /** 当前登录用户的按钮级别权限 */
  permissions?: Array<string>;
}
export interface simpleAuthority {
  authorityId: string;
  name: string;
  defaultMenu: string;
}
export const userKey = "user-info";
export const TokenKey = "authorized-token";
/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 * */
export const multipleTabsKey = "multiple-tabs";

/** 获取`token` */
export function getToken(): DataInfo<number> {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageLocal().getItem(userKey);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`、`refreshToken`这三条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`avatar`、`username`、`nickname`、`roles`、`permissions`、`refreshToken`、`expires`这七条信息放在key值为`user-info`的localStorage里（利用`multipleTabsKey`当浏览器完全关闭后自动销毁）
 */
export interface UserInfo<T> {
  id: number;
  createdAt: Date;
  uuid: string;
  email: string;
  userName?: string;
  phone: string;
  loginIps?: any;
  authorityId: string;
  authority?: Array<simpleAuthority>;
  status: number;
  nickName: string;
  avatar: string;
  tokenExpireAt: T;
}

/*此方法由setToken改造而来*/
export function setToken(data: DataInfo<Date>) {
  // 设置multipleTabsKey到Cookies，用于路由守卫判断用户是否已登录
  Cookies.set(multipleTabsKey, "true");

  if (data.userName && data.roles) {
    const { userName, nickName, roles, selectRole, avatar } = data;
    const permissions = [];
    setUserKey({ userName, nickName, roles, selectRole, avatar, permissions });
  } else {
    const userName =
      storageLocal().getItem<DataInfo<number>>(userKey)?.userName ?? "";
    const nickName =
      storageLocal().getItem<DataInfo<number>>(userKey)?.nickName ?? "";
    const roles = storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [];
    const selectRole =
      storageLocal().getItem<DataInfo<number>>(userKey)?.selectRole ?? "";
    const avatar =
      storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "";
    const permissions =
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [];
    setUserKey({ userName, nickName, roles, selectRole, avatar, permissions });
  }
}

function setUserKey({ userName, nickName, roles, selectRole, avatar, permissions }) {
  useUserStoreHook().SET_USERNAME(userName);
  useUserStoreHook().SET_NICKNAME(nickName);
  useUserStoreHook().SET_ROLES(roles);
  useUserStoreHook().SET_AVATAR(avatar);
  useUserStoreHook().SET_SELECT_ROLE(selectRole);
  useUserStoreHook().SET_PERMS(permissions);
  storageLocal().setItem(userKey, {
    avatar,
    userName,
    nickName,
    roles,
    selectRole,
    permissions
  });
}

/** 删除`token`以及key值为`user-info`的localStorage信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  Cookies.remove(multipleTabsKey);
  storageLocal().removeItem(userKey);
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};

/** 是否有按钮级别的权限（根据登录接口返回的`permissions`字段进行判断）*/
export const hasPerms = (value: string | Array<string>): boolean => {
  if (!value) return false;
  const allPerms = "*:*:*";
  const { permissions } = useUserStoreHook();
  if (!permissions) return false;
  if (permissions.length === 1 && permissions[0] === allPerms) return true;
  const isAuths = isString(value)
    ? permissions.includes(value)
    : isIncludeAllChildren(value, permissions);
  return isAuths ? true : false;
};
