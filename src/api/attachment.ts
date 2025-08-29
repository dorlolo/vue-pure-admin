import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse } from "./utils";

export const breakpointContinueUploadFile = async (data?: Object) => {
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1("/attachment/breakpointContinueUploadFile"),
    {
      data
    }
  );
};

//获取oss授权签名url
export type OssSecurityUrlModel = {
  signedUrl: string;
  xOssCallback: string;
};
export type GetOssSecurityUrlResponse = {
  code: number;
  notice: string;
  data: OssSecurityUrlModel;
};
export const PostOssSecurityUrlRequest = (data?: Object) => {
  return http.request<GetOssSecurityUrlResponse>(
    "post",
    baseUrlApiV1("/demo/oss/getOssSecurityUrl"),
    {
      data
    }
  );
};
