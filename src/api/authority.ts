import { http } from "@/utils/http";
import {
  baseUrlApiV1,
  baseResponse,
  DetailResponse,
  ListResponse
} from "./utils";

//--------------------------------------数据类型定义--------------------------------------
export type AuthorityType = {
  id: string;
  prarentId: string;
  authorityId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  name: string;
  parentId: string;
  children?: AuthorityType[];
  defaultMenu: string;
  remark: string;
  status: number;
};
export type GetAuthorityByIdResponse = DetailResponse & {
  data: AuthorityType;
};
export type GetAuthorityListResponse = ListResponse & {
  list: AuthorityType[];
};
//--------------------------------------接口定义--------------------------------------
export const CreateAuthority = async (data?: Object) => {
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1("/authority/createAuthority"),
    {
      data
    }
  );
};
export const UpdateAuthority = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1("/authority/updateAuthority"),
    {
      data
    }
  );
};

export const DeleteAuthority = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1("/authority/deleteAuthoritys"),
    {
      data
    }
  );
};

export const GetAuthorityById = async (data?: Object) => {
  return http.request<GetAuthorityByIdResponse>(
    "get",
    baseUrlApiV1("/authority/getAuthorityById"),
    {
      data
    }
  );
};

export const GetAuthorityList = async (params?: Object) => {
  return http.request<GetAuthorityListResponse>(
    "get",
    baseUrlApiV1("/authority/getAuthorityList"),
    {
      params
    }
  );
};
//获取权限菜单列表
export type AuthorityIdNameType = {
  authorityId: string;
  name: string;
};
export type GetIdNameListResponse = ListResponse & {
  list: AuthorityIdNameType[];
};
export const GetIdNameList = async () => {
  return http.request<GetIdNameListResponse>(
    "get",
    baseUrlApiV1("/authority/getIdNameList")
  );
};
