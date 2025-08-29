import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";
export type MemoryCardType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number; //
  front?: string; //正面
  back?: string; //背面
  status?: number; //状态 0:未学习 1:已学习 2:已掌握
  reviewCount?: number; //复习次数
  groupId?: number; //
  // groupInfo?:CardGroupType;//
  // tags?:[]TagType[];//
  citeId?: number; //引用卡片id
};
// 创建MemoryCard数据
export const createMemoryCard = async (data?: MemoryCardType) => {
  console.log(data);
  return http.request<baseResponse>("post", baseUrlApiV1("/study/memoryCard"), {
    data
  });
};

// 查询MemoryCard列表
export type getMemoryCardListResp = {
  list?: MemoryCardType[];
} & PageResponse;
export const getMemoryCardList = async (params?: Object) => {
  return http.request<getMemoryCardListResp>(
    "get",
    baseUrlApiV1("/study/memoryCard/list"),
    {
      params
    }
  );
};

// 查询MemoryCard详情
export type getMemoryCardDetailResp = {
  data?: MemoryCardType;
} & baseResponse;
export const getMemoryCardDetail = async (params?: Object) => {
  return http.request<getMemoryCardDetailResp>(
    "get",
    baseUrlApiV1("/study/memoryCard"),
    {
      params
    }
  );
};

//更新MemoryCard数据
export const updateMemoryCard = async (data?: Object) => {
  return http.request<baseResponse>("put", baseUrlApiV1("/study/memoryCard"), {
    data
  });
};

//删除MemoryCard数据
export const deleteMemoryCard = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1("/study/memoryCard"),
    {
      data
    }
  );
};
