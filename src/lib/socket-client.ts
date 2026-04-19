import { env } from "@/env";
import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (socket) return socket;

  // Backend base URL should be the backend origin (not /api). We derive from NEXT_PUBLIC_API_URL.
  const apiUrl = env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
  const origin = apiUrl.replace(/\/api\/?$/, "");

  socket = io(origin, {
    withCredentials: true,
    transports: ["websocket"],
  });

  return socket;
};
