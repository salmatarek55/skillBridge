
import * as signalR from "@microsoft/signalr";

const HUB_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5242/hubs/chat";

let connection = null;

export async function connectSocket(userId) {
  if (connection?.state === signalR.HubConnectionState.Connected) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${HUB_URL}?userId=${userId}`, {
      accessTokenFactory: () => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored)?.token : null;
      },
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  connection.onreconnecting(() => console.warn("SignalR reconnecting..."));
  connection.onreconnected(() => console.log("SignalR reconnected"));
  connection.onclose(() => console.log("SignalR disconnected"));

  try {
    await connection.start();
    console.log("SignalR connected");
  } catch (err) {
    console.error("SignalR connection error:", err);
  }

  return connection;
}
/////////////////////////////////////////////////////
export async function disconnectSocket() {
  if (connection) {
    await connection.stop();
    connection = null;
  }
}
/////////////////////////////////////////////////////
export function getConnection() {
  return connection;
}
/////////////////////////////////////////////////////
export function emitMessage({ requestId, senderId, receiverId, text }) {
  if (connection?.state !== signalR.HubConnectionState.Connected) {
    console.warn("SignalR not connected");
    return;
  }
  connection
    .invoke("SendMessage", { requestId, senderId, receiverId, messageText: text })
    .catch(console.error);
}
/////////////////////////////////////////////////////
export function onMessage(callback) {
  if (!connection) return;
  connection.off("ReceiveMessage");
  connection.on("ReceiveMessage", callback);
}
/////////////////////////////////////////////////////
export function emitTyping({ senderId, receiverId }) {
  if (connection?.state !== signalR.HubConnectionState.Connected) return;
  connection.invoke("SendTyping", { senderId, receiverId }).catch(console.error);
}
/////////////////////////////////////////////////////
export function onTyping(callback) {
  if (!connection) return;
  connection.off("ReceiveTyping");
  connection.on("ReceiveTyping", callback);
}
/////////////////////////////////////////////////////
export function offEvent(event) {
  connection?.off(event);
}