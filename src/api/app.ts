import { http } from "@/utils/http";
import { baseUrlApiV1, pageResult } from "./utils";

export type appType = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  uniqueIndex: string;
  name: string;
  nameEn: string;
  description: string;
  appType: number;
  table: string;
  apiGroup: Array<any>;
  menuGroup: Array<any>;
  usageState: number;
  sort: number;
  depends: Array<any>;
};
// 获取app列表
type Result = {
  code: number;
  notice: string;
  list?: Array<any>;
  pageInfo: pageResult;
};

// @Summary 获取app列表
// @Produce  application/json
// @Param
// @Router /app/getAppList [get]
export const getAppList = async (params?: Object) => {
  return http.request<Result>("get", baseUrlApiV1("/app/getAppList"), {
    params
  });
};

// 删除app
type GetAppIdResp = {
  code: number;
  notice: string;
  data: appType;
};
export const getAppDetail = (params?: object) => {
  return http.request<GetAppIdResp>("get", baseUrlApiV1("/app/getAppById"), {
    params
  });
};

// 删除app
export const deleteApps = (data?: object) => {
  return http.request<Result>("delete", baseUrlApiV1("/app/deleteApps"), {
    data
  });
};

// 更新app
export const updateApp = (data?: object) => {
  return http.request<Result>("put", baseUrlApiV1("/app/updateApp"), {
    data
  });
};
