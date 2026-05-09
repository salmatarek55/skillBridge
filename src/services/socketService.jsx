// socketService.js
// Real-time messaging via Socket.IO
// لما يكون عندك backend — غيّر SOCKET_URL

import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket = null;


export function connectSocket(userId) {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    query: { userId },
    transports: ["websocket"],
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);
    socket.emit("user:online", userId);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}


export function emitMessage({ senderId, receiverId, text }) {
  if (!socket?.connected) {
    console.warn("Socket not connected — message not sent via socket");
    return;
  }
  socket.emit("message:send", { senderId, receiverId, text });
}


export function onMessage(callback) {
  if (!socket) return;
  socket.off("message:receive");
  socket.on("message:receive", callback);
}

export function emitTyping({ senderId, receiverId }) {
  socket?.emit("typing:start", { senderId, receiverId });
}

export function onTyping(callback) {
  if (!socket) return;
  socket.off("typing:start");
  socket.on("typing:start", callback);
}


export function offEvent(event) {
  socket?.off(event);
}