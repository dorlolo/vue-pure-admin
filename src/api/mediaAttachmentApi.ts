import { http } from "@/utils/http";
import { baseUrlApiV1, baseResponse, PageResponse } from "./utils";

const mediaAttachmentBaseEndpoint = "/media/attach";
export type MediaAttachmentType = {
  id?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  uploaderId?: string; //上传者id
  fileType?: number; //文件类型：1=视频,2=音频,3=图片,4=文件,5=其它
  accessMethod?: number; //访问方式 1=下载,2=在线预览
  uploadState?: number; //上传失败是保留字段，后端逻辑中是不存在的，只是给前端用于临时展示
  videoId?: string; //视频点播服务的视频ID
  md5?: string; //
  url?: string; //
  size?: number; //
  formatType?: string; //
  source?: string; //
  downloadUrl?: string; // 这两个字段在详情页才有
  previewUrl?: string; //
  // ?: []MediaTranscodeProgressType[]; //
};
// 创建MediaAttachment数据
export const createMediaAttachment = async (data?: MediaAttachmentType) => {
  console.log(data);
  return http.request<baseResponse>(
    "post",
    baseUrlApiV1(mediaAttachmentBaseEndpoint),
    {
      data
    }
  );
};

// 查询MediaAttachment列表
export type getMediaAttachmentListResp = {
  list?: MediaAttachmentType[];
} & PageResponse;
export const getMediaAttachmentList = async (params?: Object) => {
  return http.request<getMediaAttachmentListResp>(
    "get",
    baseUrlApiV1(mediaAttachmentBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询MediaAttachment详情
export type getMediaAttachmentDetailResp = {
  data?: MediaAttachmentType;
} & baseResponse;
export const getMediaAttachmentDetail = async (params?: Object) => {
  return http.request<getMediaAttachmentDetailResp>(
    "get",
    baseUrlApiV1(mediaAttachmentBaseEndpoint),
    {
      params
    }
  );
};

//更新MediaAttachment数据
export const updateMediaAttachment = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1(mediaAttachmentBaseEndpoint),
    {
      data
    }
  );
};

//删除MediaAttachment数据
export const deleteMediaAttachment = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(mediaAttachmentBaseEndpoint),
    {
      data
    }
  );
};

const viewUserMediaBaseEndpoint = "/adm/media/userMedia";
export type ViewUserMediaType = {
  xid?: number;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  uid?: string; //用户的附件uid
  fileType?: number; //文件类型
  formatType?: string; //后缀格式
  md5?: string; //md5值
  size?: number; //大小
  source?: string; //来源
  uploadState?: number; //上传状态
  title?: string; //标题
  // coverUrl?: string; //封面
  description?: string; //描述
  nickName?: string; //用户昵称
  userUid?: string; //用户uid
  phone?: string; //手机号
  email?: string; //邮箱
  url?: string; //下载地址
};

// 查询ViewUserMedia列表
export type getViewUserMediaListResp = {
  list?: ViewUserMediaType[];
} & PageResponse;
export const getViewUserMediaList = async (params?: Object) => {
  return http.request<getViewUserMediaListResp>(
    "get",
    baseUrlApiV1(viewUserMediaBaseEndpoint + "/list"),
    {
      params
    }
  );
};

// 查询ViewUserMedia详情
export type getViewUserMediaDetailResp = {
  data?: ViewUserMediaType;
} & baseResponse;
export const getViewUserMediaDetail = async (params?: Object) => {
  return http.request<getViewUserMediaDetailResp>(
    "get",
    baseUrlApiV1(viewUserMediaBaseEndpoint),
    {
      params
    }
  );
};

//删除ViewUserMedia数据
export const deleteViewUserMedia = async (data?: Object) => {
  return http.request<baseResponse>(
    "delete",
    baseUrlApiV1(viewUserMediaBaseEndpoint),
    {
      data
    }
  );
};

//更新UserMedia数据
export const updateUserMedia = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1(viewUserMediaBaseEndpoint),
    {
      data
    }
  );
};
//恢复删除的UserMedia数据
export const recoveryUserMedia = async (data?: Object) => {
  return http.request<baseResponse>(
    "put",
    baseUrlApiV1(viewUserMediaBaseEndpoint + "/recovery"),
    {
      data
    }
  );
};
