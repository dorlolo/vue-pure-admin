import { http } from "@/utils/http";
import { baseUrlApiV1, ListResponse, baseResponse } from "./utils";


export type UserResult = {
  code: number;
  notice: string;
  data: UserInfo;
};

export type simpleAuthority = {
  authorityId: string;
  name: string;
  defaultMenu: string;
};

export type UserInfo = {
  id: number;
  createdAt: Date;
  uuid: string;
  email: string;
  userName: string;
  phone: string;
  loginIps?: any;
  authorityId: string;
  authority?: Array<simpleAuthority>;
  status: number;
  nickName: string;
  avatar: string;
  /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
  tokenExpireAt: Date;
  lang: string;
  passwordExpired: string;
  /** websocket秘钥 */
  ws: string;
};

export type deleteUserReq = {
  ids: number[];
};
/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApiV1("/login/username"), {
    data
  });
};

export const Logout = () => {
  return http.request<baseResponse>("post", baseUrlApiV1("/logout"));
};
/** 用户列表*/
export type GetUserListRequest = {
  page: number;
  pageSize: number;
  status?: number;
  uuid?: string;
  email?: string;
  phone?: string;
  userName?: string;
  nickName?: string;
};
export const GetUserList = (params?: GetUserListRequest) => {
  return http.request<ListResponse>("get", baseUrlApiV1("/user/getUserList"), {
    params
  });
};

/** 创建用户*/
export const CreateUser = (data?: object) => {
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1("/admin/user/createUser"),
    {
      data
    }
  );
};
/** 创建用户*/
export const UpdateUser = (data?: object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1("/admin/user/updateUser"),
    {
      data
    }
  );
};

/** 删除用户*/
export const DeleteUser = (data: deleteUserReq) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1("/admin/user/deleteUserByIds"),
    {
      data
    }
  );
};

/** 切换角色*/
export type SwitchRoleRequest = {
  authorityId: string;
};
export const SwitchRole = (data: SwitchRoleRequest) => {
  return http.request<UserResult>("post", baseUrlApiV1("/user/switchRole"), {
    data
  });
};

/** 重置密码*/
export type ResetPasswdRequest = {
  id: number;
  password?: string;
};
export const ResetPasswd = (data: ResetPasswdRequest) => {
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1("/admin/user/resetPasswd"),
    {
      data
    }
  );
};

/** 账户设置-个人信息 */
export const getMine = (data?: object) => {
  return http.request<UserInfo>("get", "/mine", { data });
};

/** 账户设置-个人安全日志 */
// export const getMineLogs = (data?: object) => {
//   return http.request<ResultTable>("get", "/mine-logs", { data });
// };
