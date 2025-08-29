import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";
import { ProductType } from "./productApi";
const productPackageBaseEndpoint = "/order/productPackage";
export type ProductPackageType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  productId?: number; //套餐id
  itemId?: number; //子商品id
  item?: ProductType; //
  num?: number; //数量
  duration?: number; //有效时长
  defaultCurrency?: string; //默认货币
  // discountRulerList? :[]ProductDiscountRulerType[];//
};
// 创建ProductPackage数据
export const createProductPackage = async (data?: ProductPackageType) => {
  console.log(data);
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1(productPackageBaseEndpoint),
    {
      data
    }
  );
};

// 查询ProductPackage列表
export type getProductPackageListResp = {
  list?: ProductPackageType[];
} & PageResponse;
export const getProductPackageList = async (params?: Object) => {
  return http.request<getProductPackageListResp>(
    "get",
    baseUrlApiV1(productPackageBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询ProductPackage详情
export type getProductPackageDetailResp = {
  data?: ProductPackageType;
} & baseResponse;
export const getProductPackageDetail = async (params?: Object) => {
  return http.request<getProductPackageDetailResp>(
    "get",
    baseUrlApiV1(productPackageBaseEndpoint),
    {
      params
    }
  );
};

//更新ProductPackage数据
export const updateProductPackage = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1(productPackageBaseEndpoint),
    {
      data
    }
  );
};

//删除ProductPackage数据
export const deleteProductPackage = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(productPackageBaseEndpoint),
    {
      data
    }
  );
};
