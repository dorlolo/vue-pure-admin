import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";

const backendOperationRecordBaseEndpoint = "/backendOperation";
export type BackendOperationRecordType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  domain?: string; //
  requestId?: string; //请求id
  userId?: number; //
  userName?: string; //
  ip?: string; //请求ip
  action?: string; //
  target?: string; //
  method?: string; //请求方式
  header?: string; //请求头
  path?: string; //接口路径
  body?: string; //请求体
  result?: string; //结果
  cost?: string; //耗时
  errors?: string; //处理报错
  module?: string; //模块
};
// 创建BackendOperationRecord数据
export const createBackendOperationRecord = async (
  data?: BackendOperationRecordType
) => {
  console.log(data);
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1(backendOperationRecordBaseEndpoint),
    {
      data
    }
  );
};

// 查询BackendOperationRecord列表
export type getBackendOperationRecordListResp = {
  list?: BackendOperationRecordType[];
} & PageResponse;
export const getBackendOperationRecordList = async (params?: Object) => {
  return http.request<getBackendOperationRecordListResp>(
    "get",
    baseUrlApiV1(backendOperationRecordBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询BackendOperationRecord详情
export type getBackendOperationRecordDetailResp = {
  data?: BackendOperationRecordType;
} & baseResponse;
export const getBackendOperationRecordDetail = async (params?: Object) => {
  return http.request<getBackendOperationRecordDetailResp>(
    "get",
    baseUrlApiV1(backendOperationRecordBaseEndpoint),
    {
      params
    }
  );
};

//更新BackendOperationRecord数据
export const updateBackendOperationRecord = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1(backendOperationRecordBaseEndpoint),
    {
      data
    }
  );
};

//删除BackendOperationRecord数据
export const deleteBackendOperationRecord = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(backendOperationRecordBaseEndpoint),
    {
      data
    }
  );
};
