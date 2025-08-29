import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";

const deviceBaseEndpoint = "/fonchainContainer/device";
export type DeviceType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  sn?: string; //硬件设备序列号
  location?: string; //所在位置
  netStatus?: number; //联网状态 1=在线 2=离线
  useStatus?: number; //设备状态 1=使用中 2=作废
  ip?: string; //设备外网IP
  locationIp?: string; //内网Ip
  ledType?: string; //LED类型
  remark?: string; //备注
  pingTime?: string; //最近一次ping命令的时间
  mode?: number; //1=正常模式 2=调试模式
  pinTotal?: number; //引脚/灯珠总数
  ssid?: string; //wifi名称
  password?: string; //wifi密码
  mac?: string; //设备mac地址
  version?: string; //系统版本
};
export type DeviceTypeListType = DeviceType & {
  containerRel: string;
};
// 创建Device数据
export const createDevice = async (data?: DeviceType) => {
  console.log(data);
  return http.request<baseResponse>("post", baseUrlApiV1(deviceBaseEndpoint), {
    data
  });
};

// 查询Device列表
export type getDeviceListResp = {
  list?: DeviceType[];
} & PageResponse;
export const getDeviceList = async (params?: Object) => {
  return http.request<getDeviceListResp>(
    "get",
    baseUrlApiV1(deviceBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询Device详情
export type getDeviceDetailResp = {
  data?: DeviceType;
} & baseResponse;
export const getDeviceDetail = async (params?: Object) => {
  return http.request<getDeviceDetailResp>(
    "get",
    baseUrlApiV1(deviceBaseEndpoint),
    {
      params
    }
  );
};

//更新Device数据
export const updateDevice = async (data?: Object) => {
  return http.request<baseResponse>("put", baseUrlApiV1(deviceBaseEndpoint), {
    data
  });
};

//删除Device数据
export const deleteDevice = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(deviceBaseEndpoint),
    {
      data
    }
  );
};
