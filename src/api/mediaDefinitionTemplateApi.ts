import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";

const mediaDefinitionTemplateBaseEndpoint = "/adm/media/transcodeTemplate";
export type MediaDefinitionTemplateType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  templateName: string;
  definition?: string; //
  templateId?: string; //
};
// 创建MediaDefinitionTemplate数据
export const createMediaDefinitionTemplate = async (
  data?: MediaDefinitionTemplateType
) => {
  console.log(data);
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1(mediaDefinitionTemplateBaseEndpoint),
    {
      data
    }
  );
};

// 查询MediaDefinitionTemplate列表
export type getMediaDefinitionTemplateListResp = {
  list?: MediaDefinitionTemplateType[];
} & PageResponse;
export const getMediaDefinitionTemplateList = async (params?: Object) => {
  return http.request<getMediaDefinitionTemplateListResp>(
    "get",
    baseUrlApiV1(mediaDefinitionTemplateBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询MediaDefinitionTemplate详情
export type getMediaDefinitionTemplateDetailResp = {
  data?: MediaDefinitionTemplateType;
} & baseResponse;
export const getMediaDefinitionTemplateDetail = async (params?: Object) => {
  return http.request<getMediaDefinitionTemplateDetailResp>(
    "get",
    baseUrlApiV1(mediaDefinitionTemplateBaseEndpoint),
    {
      params
    }
  );
};

//更新MediaDefinitionTemplate数据
export const updateMediaDefinitionTemplate = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1(mediaDefinitionTemplateBaseEndpoint),
    {
      data
    }
  );
};

//删除MediaDefinitionTemplate数据
export const deleteMediaDefinitionTemplate = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(mediaDefinitionTemplateBaseEndpoint),
    {
      data
    }
  );
};
