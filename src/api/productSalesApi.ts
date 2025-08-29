import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";
import { ProductMeasureUnitType } from "./productMeasureUnitRelApi";
import { CurrencyType } from "./productCurrencyApi";
const productSalesBaseEndpoint = "/admin/product/sales";
export type ProductSalesType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  productId?: number; //商品id
  measureUnitList?: ProductMeasureUnitType[]; //计量单位
  calculateUnitId?: number; //计算单位id
  unitPrice?: string; //单价
  currencyId?: number; //货币id
  currency?: CurrencyType; //货币信息
  currencyUnit?: string; //货币单位
  num?: number; //数量
  calcWay?: number; //计算方式 1=一口价 2=子项累加 3=混合
};
// 创建ProductSales数据
export const createProductSales = async (data?: ProductSalesType) => {
  console.log(data);
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1(productSalesBaseEndpoint),
    {
      data
    }
  );
};

// 查询ProductSales列表
export type getProductSalesListResp = {
  list?: ProductSalesType[];
} & PageResponse;
export const getProductSalesList = async (params?: Object) => {
  return http.request<getProductSalesListResp>(
    "get",
    baseUrlApiV1(productSalesBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询ProductSales详情
export type getProductSalesDetailResp = {
  data?: ProductSalesType;
} & baseResponse;
export const getProductSalesDetail = async (params?: Object) => {
  return http.request<getProductSalesDetailResp>(
    "get",
    baseUrlApiV1(productSalesBaseEndpoint),
    {
      params
    }
  );
};

//更新ProductSales数据
export const updateProductSales = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1(productSalesBaseEndpoint),
    {
      data
    }
  );
};

//删除ProductSales数据
export const deleteProductSales = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(productSalesBaseEndpoint),
    {
      data
    }
  );
};
