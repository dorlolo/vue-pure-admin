import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";

const currencyBaseEndpoint = "/admin/currency";
export type CurrencyType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  code?: string; //货币代码
  name?: string; //货币名称
  decimalPlaces?: number; //小数位数
  region?: string; //地区
  subunit?: number; //是否为辅币
  ratio?: number; //辅币对主币的数量比
  unit?: string; //单位
  cnUnit?: string; //中文单位
  notes?: string; //备注
};
// 创建Currency数据
export const createCurrency = async (data?: CurrencyType) => {
  console.log(data);
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1(currencyBaseEndpoint),
    {
      data
    }
  );
};

// 查询Currency列表
export type getCurrencyListResp = {
  list?: CurrencyType[];
} & PageResponse;
export const getCurrencyList = async (params?: Object) => {
  return http.request<getCurrencyListResp>(
    "get",
    baseUrlApiV1(currencyBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询Currency详情
export type getCurrencyDetailResp = {
  data?: CurrencyType;
} & baseResponse;
export const getCurrencyDetail = async (params?: Object) => {
  return http.request<getCurrencyDetailResp>(
    "get",
    baseUrlApiV1(currencyBaseEndpoint),
    {
      params
    }
  );
};

//更新Currency数据
export const updateCurrency = async (data?: Object) => {
  return http.request<baseResponse>("put", baseUrlApiV1(currencyBaseEndpoint), {
    data
  });
};

//删除Currency数据
export const deleteCurrency = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(currencyBaseEndpoint),
    {
      data
    }
  );
};
