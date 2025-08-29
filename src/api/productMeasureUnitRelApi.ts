import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";
// import { MeasureUnitType } from "@/api/productMeasureUnitApi";
const productMeasureUnitBaseEndpoint = "/admin/product/measureUnitRel";
export type ProductMeasureUnitType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  productId?: number; //商品id
  unitId?: number; //计量单位id
  salesId?: number; //销售信息id
  factor?: number; //计量单位因子
  prefix?: string; //前缀
  suffix?: string; //后缀
  sort?: number; //排序
  precision?: number; //展示精度
  // unit?: MeasureUnitType; //单位信息
  enableCalculate?: boolean; //是否启用计算
};
// 创建ProductMeasureUnit数据
export const createProductMeasureUnit = async (
  data?: ProductMeasureUnitType
) => {
  console.log(data);
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1(productMeasureUnitBaseEndpoint),
    {
      data
    }
  );
};

// 查询ProductMeasureUnit列表
export type getProductMeasureUnitListResp = {
  list?: ProductMeasureUnitType[];
} & PageResponse;
export const getProductMeasureUnitList = async (params?: Object) => {
  return http.request<getProductMeasureUnitListResp>(
    "get",
    baseUrlApiV1(productMeasureUnitBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询ProductMeasureUnit详情
export type getProductMeasureUnitDetailResp = {
  data?: ProductMeasureUnitType;
} & baseResponse;
export const getProductMeasureUnitDetail = async (params?: Object) => {
  return http.request<getProductMeasureUnitDetailResp>(
    "get",
    baseUrlApiV1(productMeasureUnitBaseEndpoint),
    {
      params
    }
  );
};

//更新ProductMeasureUnit数据
export const updateProductMeasureUnit = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1(productMeasureUnitBaseEndpoint),
    {
      data
    }
  );
};

//删除ProductMeasureUnit数据
export const deleteProductMeasureUnit = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(productMeasureUnitBaseEndpoint),
    {
      data
    }
  );
};
