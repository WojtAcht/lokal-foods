import { CLIENT_ID } from "./app";

const socketURL = "ws://192.168.123.116:3000/api/websockets";

export function connectSocket(
  onStamp: (restaurantId: number, isFinished: boolean) => void
): WebSocket {
  const socket = new WebSocket(socketURL);

  socket.addEventListener("open", (e) => {
    socket.send(JSON.stringify({ id: CLIENT_ID }));
  });

  socket.addEventListener("message", (messageEvent) => {
    const messageData = JSON.parse(messageEvent.data) as {
      id: string;
      "client-id": string;
      success: boolean;
      "stamp-hash": string;
      finished: boolean;
    };
    if (
      messageData?.success &&
      messageData?.["stamp-hash"] &&
      messageData?.["client-id"]
    ) {
      onStamp(Number(messageData["client-id"]), messageData?.finished ?? false);
    }
  });

  return socket;
}
