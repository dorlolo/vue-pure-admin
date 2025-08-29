import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";
import { ProductPackageType } from "./productPackageApi";
import { MediaAttachmentType } from "./mediaAttachmentApi";
// import { ProductTagType } from "./orderProductTagApi";
import { ProductSalesType } from "./productSalesApi";
const productBaseEndpoint = "/admin/product";
export type tagType = {
  id: number;
  name?: string;
  key?: string;
  sort?: number;
  parentId?: number;
};
export type ProductType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  productNo?: string; //商品编号
  key?: string; //关键字
  name?: string; //商品名
  desc?: string; //商品描述
  content?: string; //详细描述、详细说明
  mediaList?: MediaAttachmentType[]; //
  webView?: string; //web端展示
  productType?: number; //商品类型,1=独立商品 2=套餐商品 3=套餐商品子项
  Packages?: ProductPackageType[]; //套餐商品子项列表
  mTagId?: number; //主标签id
  tags?: tagType[]; //副标签列表
  status?: number; //1=预发布 2=已上架 3=已下架
  defaultCurrencyId?: number; //默认货币Id
  sales?: ProductSalesType; //销售价格
  // ?: []ProductDiscountType[]; //折扣
  mTagName?: string; //主标签名称
  defaultCurrencyName?: string; //默认货币
  packParentId?: number; //套餐商品父级id
  packGroupId?: number; //套餐商品分组id
  packSort?: number; //套餐商品排序
};

// 创建Product数据
export const createProduct = async (data?: ProductType) => {
  console.log(data);
  return http.request<baseResponse>("post", baseUrlApiV1(productBaseEndpoint), {
    data
  });
};

// 查询Product列表
export type getProductListResp = {
  list?: ProductType[];
} & PageResponse;
export const getProductList = async (params?: Object) => {
  return http.request<getProductListResp>(
    "get",
    baseUrlApiV1(productBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询Product详情
export type getProductDetailResp = {
  data?: ProductType;
} & baseResponse;
export const getProductDetail = async (params?: Object) => {
  return http.request<getProductDetailResp>(
    "get",
    baseUrlApiV1(productBaseEndpoint),
    {
      params
    }
  );
};

//更新Product数据
export const updateProduct = async (data?: Object) => {
  return http.request<baseResponse>("put", baseUrlApiV1(productBaseEndpoint), {
    data
  });
};

//删除Product数据
export const deleteProduct = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(productBaseEndpoint),
    {
      data
    }
  );
};
