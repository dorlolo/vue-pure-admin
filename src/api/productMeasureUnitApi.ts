import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";

const measureUnitBaseEndpoint = "/admin/measureUnit";
export type MeasureUnitType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  groupName?: string; //分组名称
  name?: string; //计量单位名称
  key?: string; //计量单位key
  packFollowParentNum?: number; //计算时跟随父级数量
};
// 创建MeasureUnit数据
export const createMeasureUnit = async (data?: MeasureUnitType) => {
  console.log(data);
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1(measureUnitBaseEndpoint),
    {
      data
    }
  );
};

// 查询MeasureUnit列表
export type getMeasureUnitListResp = {
  list?: MeasureUnitType[];
} & PageResponse;
export const getMeasureUnitList = async (params?: Object) => {
  return http.request<getMeasureUnitListResp>(
    "get",
    baseUrlApiV1(measureUnitBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询MeasureUnit详情
export type getMeasureUnitDetailResp = {
  data?: MeasureUnitType;
} & baseResponse;
export const getMeasureUnitDetail = async (params?: Object) => {
  return http.request<getMeasureUnitDetailResp>(
    "get",
    baseUrlApiV1(measureUnitBaseEndpoint),
    {
      params
    }
  );
};

//更新MeasureUnit数据
export const updateMeasureUnit = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1(measureUnitBaseEndpoint),
    {
      data
    }
  );
};

//删除MeasureUnit数据
export const deleteMeasureUnit = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(measureUnitBaseEndpoint),
    {
      data
    }
  );
};
