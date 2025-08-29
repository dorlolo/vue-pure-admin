import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";

const mediaOssRegionBaseEndpoint = "/adm/media/ossRegion";
export type MediaOssRegionType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  regionId?: string; //区域id
  bucketName?: string; //bucket名称
};
// 创建MediaOssRegion数据
export const createMediaOssRegion = async (data?: MediaOssRegionType) => {
  console.log(data);
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1(mediaOssRegionBaseEndpoint),
    {
      data
    }
  );
};

// 查询MediaOssRegion列表
export type getMediaOssRegionListResp = {
  list?: MediaOssRegionType[];
} & PageResponse;
export const getMediaOssRegionList = async (params?: Object) => {
  return http.request<getMediaOssRegionListResp>(
    "get",
    baseUrlApiV1(mediaOssRegionBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询MediaOssRegion详情
export type getMediaOssRegionDetailResp = {
  data?: MediaOssRegionType;
} & baseResponse;
export const getMediaOssRegionDetail = async (params?: Object) => {
  return http.request<getMediaOssRegionDetailResp>(
    "get",
    baseUrlApiV1(mediaOssRegionBaseEndpoint),
    {
      params
    }
  );
};

//更新MediaOssRegion数据
export const updateMediaOssRegion = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1(mediaOssRegionBaseEndpoint),
    {
      data
    }
  );
};

//删除MediaOssRegion数据
export const deleteMediaOssRegion = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(mediaOssRegionBaseEndpoint),
    {
      data
    }
  );
};
