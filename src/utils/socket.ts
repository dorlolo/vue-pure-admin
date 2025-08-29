import { wsMessage } from "@/api/websocket";
import { storageSession } from "@pureadmin/utils";
let websocket: WebSocket | null = null;
export function createWebSocket(userUuid, websocketSecret): WebSocket {
  const { VITE_WEBSOCKET_URL } = import.meta.env;
  websocket = new WebSocket(VITE_WEBSOCKET_URL + "/v1/ws");
  websocket.onopen = () => {
    console.log("ws正在连接");
    sendWsMessage({
      type: "register",
      from: userUuid,
      to: "0",
      content: websocketSecret
    }); // 在连接建立后发送消息
  };
  //接收到消息的回调方法
  websocket.onmessage = function (event) {
    handleReceivedMessage(event);
  };
  //连接关闭的回调方法
  websocket.onclose = function () {
    console.log("ws连接关闭");
  };

  return websocket;
}

export function sendWsMessage(msg: wsMessage) {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(msg));
  } else {
    console.error("WebSocket 未建立连接或已关闭");
  }
}

export function handleReceivedMessage(event: MessageEvent) {
  console.log("Received message data", event.data);
  const message: wsMessage = JSON.parse(event.data);
  switch (message.type) {
    case "Error":
      console.log("收到消息:", message.content);
      break;
    case "register":
      console.log("收到注册消息:", message.content);
      storageSession().setItem("clientId", message.content.clientId);
      break;
    case "message":
      console.log("收到普通消息:", message.content);
      // 在这里执行处理普通消息的逻辑
      break;
    // 其他 case 分支...
    default:
      console.warn("未知的消息类型:", message.type);
  }
}
