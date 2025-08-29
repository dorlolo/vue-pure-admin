// import { AxiosRequestConfig } from "axios";
import { message } from "@/utils/message";
export const baseUrlApiV1 = (url: string) => `/api/v1${url}`;
export const defineUrlApi = (version: string, url: string) =>
  `/api/${version}${url}`;
export const pageAllListParam = {
  params: { page: 1, pageSize: -1 }
};
export type pageResult = {
  page: number;
  pageSize: number;
  total: number;
};

export type commonIdName = {
  id: number;
  name: string;
};

export type commonIdNameList = commonIdName[];
export type deleteReq = {
  id: number;
  ids: Array<number>;
};

// 基本返回类型
export type baseResponse = {
  code: number;
  notice: string;
  err: string;
};
// 详情接口返回值类型
export type DetailResponse = baseResponse & {
  data: any;
};
// 列表接口返回值类型
export type ListResponse = baseResponse & {
  list: any;
  pageInfo: pageResult;
};
export type PageResponse = baseResponse & {
  pageInfo: pageResult;
};
//返回值code判断，如果错误则弹出错误弹窗
export const HandleResponseCode = function (
  resp: baseResponse,
  silent = false
): Boolean {
  if (resp.code === 0) {
    if (silent === false) {
      message(resp.notice, { type: "success" });
    }
    return true;
  } else {
    if (silent === false) {
      message(resp.notice, { type: "error" });
    }
    return false;
  }
};
export const HandleResponseErr = function (resp: baseResponse): Boolean {
  if (resp.code !== 0) {
    message(resp.notice, { type: "error" });
    return false;
  }
  return true;
};
