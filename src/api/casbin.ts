import { http } from "@/utils/http";
import { baseResponse, baseUrlApiV1, ListResponse } from "./utils";

export interface casbinInfo {
  path: string;
  method: string;
}
export type GetCasbinPolicyListResponse = ListResponse & {
  List: casbinInfo[];
};

// 获取casbin中
// @params: authorityId string 权限id
export const GetCasbinPolicyList = async (params?: object) => {
  return http.request<GetCasbinPolicyListResponse>(
    "get",
    baseUrlApiV1("/casbin/getCasbinPolicyList"),
    {
      params
    }
  );
};

// 更新casbinApi
export const UpdateCasbinApi = async (data?: object) => {
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1("/casbin/updateCasbinApi"),
    {
      data
    }
  );
};
