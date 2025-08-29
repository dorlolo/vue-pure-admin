import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse } from "./utils";
export type vercodeInfo = {
  captchaId: string;
  picPath: string;
  captchaLength: number;
};
export type vercoeResponse = baseResponse & {
  data: vercodeInfo;
};
//支持的验证码类型
type VercodeType = "mobile" | "image" | "email";
// 获取验证码
export const getVercode = async (vercodeType: VercodeType) => {
  return http.request<vercoeResponse>(
    "post",
    baseUrlApiV1("/captcha/" + vercodeType)
  );
};
