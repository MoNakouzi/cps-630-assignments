import { io } from "socket.io-client";
import API_BASE_URL from "../config";

let socket = null;

export function connectChatSocket(token) {
  if (!token) return null;

  if (!socket) {
    socket = io(API_BASE_URL, {
      auth: {
        token,
      },
    });
  }

  return socket;
}

export function getChatSocket() {
  return socket;
}

export function disconnectChatSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}