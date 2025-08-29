import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse } from "./utils";
export type UploadMediaRequest = {
  fileName: string;
  md5: string;
  fileSize: number;
  fileType: string;
  suffix: string;
  title: string;
  description: string;
  source?: string;
};
interface attachUploadData {
  uid: string;
  state: number;
  md5: string;
  title: string;
  description: string;
  url: string;
  auth?: UploadAuth;
}

interface UploadAuth {
  signedUrl: string;
  xOssCallback: string;
}
export type mediaAttachUploadResp = {
  data?: attachUploadData;
} & baseResponse;
//生成文件上传url
export const mediaAttachUpload = async (data?: UploadMediaRequest) => {
  return http.request<mediaAttachUploadResp>(
    "post",
    baseUrlApiV1("/media/attach/upload"),
    {
      data
    }
  );
};
