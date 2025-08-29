import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";
import { ProductType } from "./productApi";
const productPackageGroupBaseEndpoint = "/admin/productPackageGroup";
export type ProductPackageGroupType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  productId?: number; //套餐id
  name?: string; //
  key?: string; //
  desc?: string; //套餐分组描述
  items?: ProductType[];
};

// export type PackageGroupSubProductType = {
//   id?: number;
//   productId?: number;
//   groupId?: number;
//   name?: string;
//   key?: string;
//   webView?: string;
//   measureUnit: string;
//   num?: number;
// };

// 创建ProductPackageGroup数据
export const createProductPackageGroup = async (
  data?: ProductPackageGroupType
) => {
  console.log(data);
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1(productPackageGroupBaseEndpoint),
    {
      data
    }
  );
};

// 查询ProductPackageGroup列表
export type getProductPackageGroupListResp = {
  list?: ProductPackageGroupType[];
} & PageResponse;
export const getProductPackageGroupList = async (params?: Object) => {
  return http.request<getProductPackageGroupListResp>(
    "get",
    baseUrlApiV1(productPackageGroupBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询ProductPackageGroup详情
export type getProductPackageGroupDetailResp = {
  data?: ProductPackageGroupType;
} & baseResponse;
export const getProductPackageGroupDetail = async (params?: Object) => {
  return http.request<getProductPackageGroupDetailResp>(
    "get",
    baseUrlApiV1(productPackageGroupBaseEndpoint),
    {
      params
    }
  );
};

//更新ProductPackageGroup数据
export const updateProductPackageGroup = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1(productPackageGroupBaseEndpoint),
    {
      data
    }
  );
};

//删除ProductPackageGroup数据
export const deleteProductPackageGroup = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(productPackageGroupBaseEndpoint),
    {
      data
    }
  );
};
