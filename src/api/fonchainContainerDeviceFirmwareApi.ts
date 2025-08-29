import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";

const deviceFirmwareBaseEndpoint = "/fonchainContainer/deviceFirmware";
export type DeviceFirmwareType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  version?: string; //
  url?: string; //
  env?: number;
};
// 创建DeviceFirmware数据
export const createDeviceFirmware = async (data?: DeviceFirmwareType) => {
  console.log(data);
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1(deviceFirmwareBaseEndpoint),
    {
      data
    }
  );
};

// 查询DeviceFirmware列表
export type getDeviceFirmwareListResp = {
  list?: DeviceFirmwareType[];
} & PageResponse;
export const getDeviceFirmwareList = async (params?: Object) => {
  return http.request<getDeviceFirmwareListResp>(
    "get",
    baseUrlApiV1(deviceFirmwareBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询DeviceFirmware详情
export type getDeviceFirmwareDetailResp = {
  data?: DeviceFirmwareType;
} & baseResponse;
export const getDeviceFirmwareDetail = async (params?: Object) => {
  return http.request<getDeviceFirmwareDetailResp>(
    "get",
    baseUrlApiV1(deviceFirmwareBaseEndpoint),
    {
      params
    }
  );
};

//更新DeviceFirmware数据
export const updateDeviceFirmware = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1(deviceFirmwareBaseEndpoint),
    {
      data
    }
  );
};

//删除DeviceFirmware数据
export const deleteDeviceFirmware = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(deviceFirmwareBaseEndpoint),
    {
      data
    }
  );
};
const axiosConfig = {
  timeout: 900000 // 设置本次请求的超时时间为 90秒
};
export const otaDeviceFirmware = async (data?: Object) => {
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1(deviceFirmwareBaseEndpoint + "/ota"),
    {
      data
    },
    axiosConfig
  );
};
