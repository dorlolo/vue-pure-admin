import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";

const productTagBaseEndpoint = "/admin/product/tag";
export type ProductTagType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string; //产品类别
  key?: string; //
  sort?: number; //排序编号
  parentId?: number; //
  children?: ProductTagType[];
};
// 创建productTag数据
export type createProductTagResp = {
  data?: ProductTagType;
} & baseResponse;
export const createProductTag = async (data?: ProductTagType) => {
  console.log(data);
  return http.request<createProductTagResp>(
    "post",
    baseUrlApiV1(productTagBaseEndpoint),
    {
      data
    }
  );
};

// 查询productTag列表
export type getProductTagListResp = {
  list?: ProductTagType[];
} & PageResponse;
export const getProductTagList = async (params?: Object) => {
  return http.request<getProductTagListResp>(
    "get",
    baseUrlApiV1(productTagBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询productTag详情
export type getProductTagDetailResp = {
  data?: ProductTagType;
} & baseResponse;
export const getProductTagDetail = async (params?: Object) => {
  return http.request<getProductTagDetailResp>(
    "get",
    baseUrlApiV1(productTagBaseEndpoint),
    {
      params
    }
  );
};

//更新productTag数据
export const updateProductTag = async (data?: Object) => {
  return http.request<createProductTagResp>(
    "put",
    baseUrlApiV1(productTagBaseEndpoint),
    {
      data
    }
  );
};

//删除productTag数据
export const deleteProductTag = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(productTagBaseEndpoint),
    {
      data
    }
  );
};
