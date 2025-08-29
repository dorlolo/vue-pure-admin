import { http } from "@/utils/http";
import {
  baseUrlApiV1,
  pageResult,
  baseResponse,
  commonIdNameList,
  ListResponse
} from "./utils";
export type AppMenuType = {
  id?: number;
  createdAt?: Date;
  updateAt?: Date;
  appId: number;
  name: string;
  autoEnable: number;
  parentId: number;
  parentPath: string;
  children?: Array<AppMenuType>;
  path: string;
  component: string;
  title: string;
  icon: string;
  rank: number;
  showParent: boolean;
  keepAlive: boolean;
  showLink: boolean;
};
type getMenuListResp = {
  code: number;
  notice: string;
  list?: Array<AppMenuType>;
  pageInfo: pageResult;
};
export const getAppMenuList = async (params?: Object) => {
  return http.request<getMenuListResp>(
    "get",
    baseUrlApiV1("/appMenu/getAppMenuList"),
    {
      params
    }
  );
};

type getAppMenuByIdResp = {
  code: number;
  notice: string;
  data?: AppMenuType;
};
export const getAppMenuById = async (params?: Object) => {
  return http.request<getAppMenuByIdResp>(
    "get",
    baseUrlApiV1("/appMenu/getAppMenuById"),
    {
      params
    }
  );
};

export const deleteAppMenus = async (params?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1("/appMenu/deleteAppMenus"),
    {
      params
    }
  );
};

export const updateAppMenu = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1("/appMenu/updateAppMenu"),
    {
      data
    }
  );
};

export const createAppMenu = async (data?: AppMenuType) => {
  console.log(data);
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1("/appMenu/createAppMenu"),
    {
      data
    }
  );
};
type getMenuDropDownListResp = {
  code: number;
  notice: string;
  list: commonIdNameList;
  pageInfo: pageResult;
};
export const getMenuDropDownList = async (params?: Object) => {
  return http.request<getMenuDropDownListResp>(
    "get",
    baseUrlApiV1("/appMenu/getIdPathDropDownList"),
    {
      params
    }
  );
};

//获取基本的菜单树
// export type GetAuthorityListResponse = ListResponse & {
//   list: any;
// };
export const getBaseMenuTree = async () => {
  return http.request<ListResponse>(
    "get",
    baseUrlApiV1("/appMenu/getBaseMenuTreeMap")
  );
};

//获取权限关联的菜单列表
export const getAuthorityMenus = async (params?: Object) => {
  return http.request<getMenuListResp>(
    "get",
    baseUrlApiV1("/appMenu/getAuthorityMenus"),
    {
      params
    }
  );
};

//
// @Tags appMenu
// @Summary 设置角色菜单
// @accept application/json
// @Produce application/json
// @Param authorityId string
// @Param menuIds []number
// @Success 200 {string} string "{"success":true,"data":{},"notice":"操作成功"}"
// @Router /appMenu/setAuthorityMenu [put]
export const setAuthorityMenu = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1("/appMenu/setAuthorityMenu"),
    {
      data
    }
  );
};

export type ViewAppMenuType = {
  id?: number;
  createdAt?: Date;
  updateAt?: Date;
  appId: number;
  name: string;
  autoEnable: number;
  parentId: number;
  parentPath: string;
  children?: Array<AppMenuType>;
  path: string;
  component: string;
  title: string;
  icon: string;
  rank: number;
  showParent: boolean;
  keepAlive: boolean;
  showLink: boolean;
  appName?: string;
  authList?: Array<MenuAuthType>;
};
export type MenuAuthType = {
  id?: number;
  name: string;
  value: string;
};
//
// @Tags setAuthorityMenu
// @Summary 获取菜单树
// @accept application/json
// @Produce application/json
// @Param menuIds []number
// @Success 200 {string} string "{"success":true,"data":{},"notice":"操作成功"}"
// @Router /menu/getTree [get]
export const GetMenuTree = async (params?: Object) => {
  return http.request<ListResponse>("get", baseUrlApiV1("/menu/getTree"), {
    params
  });
};
