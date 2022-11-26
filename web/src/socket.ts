const socketURL = "ws://localhost:3000/api/websockets";

export function connectSocket(): WebSocket {
  const socket = new WebSocket(socketURL);

  socket.addEventListener("open", (e) => {
    socket.send(JSON.stringify({ id: "0" }));
  });

  socket.addEventListener("message", (messageEvent) => {
    console.log(messageEvent);
  });

  return socket;
}
