import { http } from "@/utils/http";
import { baseUrlApiV1, pageResult, baseResponse } from "./utils";

export type operationRecordType = {
  createdAt: string;
  domain?: string;
  requestId?: string; //请求id
  userId?: 0;
  ip?: string; //请求ip
  action?: string;
  method?: string; //请求方式
  header?: string; //请求头
  path?: string; //接口路径
  message?: string; //消息内容
  body?: string;
  target?: string;
  result?: string;
  cost?: string; //耗时
  errors?: string; //处理报错
};
export type operationRecordRequqest = {
  page: number;
  pageSize: number;
  env: number;
  userName: string;
  phone: string;
  likeTime: string;
  startTime: string;
  endTime: string;
  body: string;
  result: string;
  errors: string;
} & operationRecordType;
export type getOperationRecordListResponse = {
  list?: Array<operationRecordType>;
  pageInfo: pageResult;
} & baseResponse;
//获取画家宝api调用记录
export const getOperationRecordList = async (params?: Object) => {
  return http.request<getOperationRecordListResponse>(
    "get",
    baseUrlApiV1("/operationRecord/getList"),
    {
      params
    }
  );
};
export type getOperationRecordDetailResponse = {
  data?: operationRecordType;
} & baseResponse;
//获取画家宝api调用记录详情
export const getOperationRecordDetail = async (params?: Object) => {
  return http.request<getOperationRecordDetailResponse>(
    "get",
    baseUrlApiV1("/operationRecord/getDataById"),
    {
      params
    }
  );
};

export const deleteOperationRecord = async (params?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1("/operationRecord/delete"),
    {
      params
    }
  );
};
const axiosConfig = {
  timeout: 900000 // 设置本次请求的超时时间为 5000 毫秒
};
export const execFastCommand = async (data?: Object) => {
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1("/artistinfo/fast/exec"),
    {
      data
    },
    axiosConfig
  );
};

export const execAuctionFastCommand = async (data?: Object) => {
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1("/auction/fast/exec"),
    {
      data
    },
    axiosConfig
  );
};
