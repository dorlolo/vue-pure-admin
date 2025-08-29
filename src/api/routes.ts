import { http } from "@/utils/http";
import { baseUrlApiV1 } from "./utils";

type Result = {
  success: boolean;
  list: Array<any>;
};

export const getAsyncRoutes = () => {
  return http.request<Result>("get", baseUrlApiV1("/appMenu/getAsyncMenus"));
};
