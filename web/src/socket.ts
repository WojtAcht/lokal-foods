const socketURL = "ws://localhost:3000/api/websockets";

export function connectSocket(
  onStamp: (restaurantId: number) => void
): WebSocket {
  const socket = new WebSocket(socketURL);

  socket.addEventListener("open", (e) => {
    socket.send(JSON.stringify({ id: "0" }));
  });

  socket.addEventListener("message", (messageEvent) => {
    const messageData = JSON.parse(messageEvent.data) as {
      id: string;
      "client-id": string;
      success: boolean;
      "stamp-hash": string;
    };
    if (
      messageData?.success &&
      messageData?.["stamp-hash"] &&
      messageData?.["client-id"]
    ) {
      onStamp(Number(messageData["client-id"]));
    }
  });

  return socket;
}
