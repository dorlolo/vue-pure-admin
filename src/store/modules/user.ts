import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import { getLogin, simpleAuthority, UserResult, UserInfo } from "@/api/user";
import { Logout } from "@/api/user";
// import { createWebSocket, sendWsMessage } from "@/api/socket";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";

export const useUserStore = defineStore("pure-user", {
  state: (): userType => ({
    // 头像
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.userName ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    //当前选择的角色
    selectRole:
      storageLocal().getItem<DataInfo<number>>(userKey)?.selectRole ?? "",
    // 按钮级别权限
    permissions:
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    // 前端生成的验证码（按实际需求替换）
    verifyCode: "",
    // 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
    currentPage: 0,
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<simpleAuthority>) {
      this.roles = roles;
    },
    /** 存储选择的角色 */
    SET_SELECT_ROLE(role: string) {
      console.log("SET_SELECT_ROLE", role);
      this.selectRole = role;
    },
    /** 存储头像 */
    SET_USER_AVATAR(userAvatar: string) {
      // console.log("SET_USER_AVATAR", userAvatar);
      this.avatar = userAvatar;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储登录页面显示哪个组件 */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(response => {
            if (response.code === 0) {
              const tokenData = userInfoToDataInfo(response.data);
              setToken(tokenData);
              // todo 先禁用websocket连接
              // console.log("websocket建立连接,ws:", response.data.ws);
              // createWebSocket(response.data.uuid, response.data.ws);
              // sendWsMessage({
              //   type: "register",
              //   to: "0",
              //   from: "" + response.data.uuid,
              //   content: response.data.ws
              // });
            }
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
function userInfoToDataInfo(user: UserInfo): DataInfo<number> {
  return {
    userName: user.userName,
    nickName: user.nickName,
    avatar: user.avatar,
    roles: user.authority ?? [],
    selectRole: user.authorityId,
    permissions: [] // 如果有权限字段请补充
  };
}