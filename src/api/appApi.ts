import { http } from "@/utils/http";
import { baseUrlApiV1, pageResult, ListResponse, baseResponse } from "./utils";

// /appApi/createAppApi
// /appApi/deleteAppApis
// /appApi/updateAppApi
// /appApi/getAppApiById
// /appApi/getAppApiList
export type ApiType = {
  xid: number;
  id: number;
  appId: number;
  createdAt: Date;
  updateAt: Date;
  appid: number;
  summary: string;
  description: string;
  tagsIds: Array<number>;
  method: string;
  version: string;
  path: string;
  checked: boolean;
  open: boolean;
  tags: Array<TagType>;
  parameters?: Array<paramsDefType>;
  responses?: Array<paramsDefType>;
};
export type paramsDefType = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  apiId: number;
  messageType?: number; //1=请求参数 2=返回值
  in: string;
  name: string;
  description: string;
  required: boolean;
  paramType: string;
  paramRef: string;
  params?: Array<userParamType>;
};
export type userParamType = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  apiId: number;
  defId: number;
  isChecked: number;
  key: string;
  widget: string;
  description: string;
  notNull: boolean;
  fieldType: string;
  value: string;
  pid: number;
  params: Array<userParamType>;
};
export type TagType = {
  id: number;
  name: string;
  description: string;
  bg: string;
  color: string;
};
type getApiListResp = {
  code: number;
  notice: string;
  list?: Array<ApiType>;
  pageInfo?: pageResult;
};
export const getApiList = async (params?: Object) => {
  return http.request<getApiListResp>("get", baseUrlApiV1("/appApi/getList"), {
    params
  });
};
type getApiDetailResp = {
  data?: ApiType;
} & baseResponse;
export const getApiDetail = async (params?: Object) => {
  return http.request<getApiDetailResp>(
    "get",
    baseUrlApiV1("/appApi/getDetail"),
    {
      params
    }
  );
};

export const createApi = async (data?: Object) => {
  return http.request<getApiListResp>("post", baseUrlApiV1("/appApi/create"), {
    data
  });
};

export const deleteApis = async (data?: Object) => {
  return http.request<getApiListResp>(
    "delete",
    baseUrlApiV1("/appApi/delete"),
    {
      data
    }
  );
};

export const updateApi = async (data?: Object) => {
  return http.request<getApiListResp>("put", baseUrlApiV1("/appApi/update"), {
    data
  });
};
interface AppApiTreeType {
  id: number;
  Name: string;
  Children: AppApiTreeChild[];
}

interface AppApiTreeChild {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  appId: number;
  summary: string;
  description: string;
  tagsIds?: any;
  method: number;
  version: string;
  path: string;
}
export type GetAppApiResponse = ListResponse & {
  list: AppApiTreeType[];
};
export const GetAPiTree = async () => {
  return http.request<GetAppApiResponse>(
    "get",
    baseUrlApiV1("/appApi/getTree")
  );
};
