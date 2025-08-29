import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";

const aiPromptParamsBaseEndpoint = "/ai/promptParams";
export type AiPromptParamsType = {
  id: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  projectName: string; //项目名
  projectType?: string; //项目类型
  dataType: number; //数据类型
  key: string; //提示词模板中的key
  value: string; //值
};
export type ProjectParam = {
  id: number;
  key: string;
  value: string;
};
export type ProjectPrompt = {
  projectName: string;
  projectType: string;
  params: ProjectParam[];
};
// 创建AiPromptParams数据
export const createAiPromptParams = async (data?: AiPromptParamsType) => {
  console.log(data);
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1(aiPromptParamsBaseEndpoint),
    {
      data
    }
  );
};

// 查询AiPromptParams列表
export type getAiPromptParamsListResp = {
  list?: AiPromptParamsType[];
} & PageResponse;
export const getAiPromptParamsList = async (params?: Object) => {
  return http.request<getAiPromptParamsListResp>(
    "get",
    baseUrlApiV1(aiPromptParamsBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询项目参数分组列表
export type getProjectPromptGroupListResp = {
  data?: ProjectPrompt[];
} & PageResponse;
export const getProjectPromptGroupList = async (params?: Object) => {
  return http.request<getProjectPromptGroupListResp>(
    "get",
    baseUrlApiV1("/ai/project/promptGroup"),
    {
      params
    }
  );
};

// 查询AiPromptParams详情
export type getAiPromptParamsDetailResp = {
  data?: AiPromptParamsType;
} & baseResponse;
export const getAiPromptParamsDetail = async (params?: Object) => {
  return http.request<getAiPromptParamsDetailResp>(
    "get",
    baseUrlApiV1(aiPromptParamsBaseEndpoint),
    {
      params
    }
  );
};

//更新AiPromptParams数据
export const updateAiPromptParams = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1(aiPromptParamsBaseEndpoint),
    {
      data
    }
  );
};

export const saveProjectPromptGroup = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1("/ai/project/promptGroup"),
    {
      data
    }
  );
};
//删除AiPromptParams数据
export const deleteAiPromptParams = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(aiPromptParamsBaseEndpoint),
    {
      data
    }
  );
};
