import { http } from "@/utils/http";
import { baseResponse, baseUrlApiV1 } from "./utils";

export type swaggerDocType = {
  schemes: Array<string>;
  host: string;
  basePath: string;
  info: {
    title: string;
    version: string;
    description: string;
    contact: {
      name: string;
      url: string;
    };
  };
};
export const GetSwaggerDocs = async (params?: object) => {
  return http.request<swaggerDocType>(
    "get",
    baseUrlApiV1("/swagger/docs/doc.json"),
    {
      params
    }
  );
};

export const DocReload = async () => {
  return http.request<baseResponse>("post", baseUrlApiV1("/docs/reload"));
};
export type paramsDefType = {
  id: number;
  name: string;
  paramType: string;
  description: string;
  properties: Array<paramsPropertieType>;
};
export type paramsPropertieType = {
  defId: number;
  name: string;
  fieldType: string;
  ref: string;
  description: string;
  example: string;
  nullable: boolean;
  required: boolean;
};
export type GetApiParamsResp = {
  list: Array<paramsDefType>;
} & baseResponse;
export const GetApiParams = async (params?: Array<string>) => {
  return http.request<GetApiParamsResp>(
    "get",
    baseUrlApiV1("/docs/getApiParams"),
    {
      params
    }
  );
};
