import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse } from "./utils";

const aiCodeBaseEndpoint = "/ai/code";

export type CodeInfo = {
  moduleLevel: string;
  path: string;
  content: string;
};

export type CodeModule = {
  moduleLevel: string;
  codeList: CodeInfo[];
};

export type GenerateCodeResp = {
  conversationId: string; //会话id
  moduleList: CodeModule[]; //模块代码列表
  flowUp: string[]; //提示信息
};

export type GernerateCodeRequest = {
  conversationId: string; //会话id
  projectName: string; //项目名
  moduleLevel: string; //模型层级
  content: string;
  action: string; //gen:生成代码,genNext: 重新生成代码,fix:修复代码
};

// 生成代码
const axiosConfig = {
  timeout: 900000 // 设置本次请求的超时时间为 5000 毫秒
};
export type aiGenerateCodeResp = {
  data?: GenerateCodeResp;
} & baseResponse;
export const aiGenerateCode = async (data?: GernerateCodeRequest) => {
  console.log(data);
  return http.request<aiGenerateCodeResp>(
    "post",
    baseUrlApiV1(aiCodeBaseEndpoint + "/gen"),
    {
      data
    },
    axiosConfig
  );
};
