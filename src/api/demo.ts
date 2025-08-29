import { http } from "@/utils/http";
import { baseUrlApiV1 } from "./utils";
export type Demo = {
  address: string;
  age: number;
  authorityId: string;
  createdAt: string;
  deletedAt?: any;
  depId: number;
  detail: Detail;
  id: number;
  idNum: string;
  items: Item[];
  many: Many[];
  name: string;
  phone: string;
  postId: number;
  updatedAt: string;
  userId: number;
};

export type Many = {
  createdAt: string;
  deletedAt?: any;
  demos?: any;
  id: number;
  manyFrom: string;
  updatedAt: string;
};

export type Item = {
  createdAt: string;
  deletedAt?: any;
  demoId: number;
  id: number;
  itemName: string;
  updatedAt: string;
};

export type Detail = {
  createdAt: string;
  deletedAt?: any;
  demoId: number;
  id: number;
  nickName: string;
  qq: string;
  sina: string;
  updatedAt: string;
  wx: string;
};

export const demoGetList = async (data?: Object) => {
  return http.request<any>("post", baseUrlApiV1("/demo/getDemoList"), {
    data
  });
};
