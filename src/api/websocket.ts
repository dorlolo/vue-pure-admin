export type wsMessage = {
  from: string;
  to: string;
  type: string;
  content: any | wsUserInfo;
};
export type wsUserInfo = {
  uuid: string;
  userId: number;
};
