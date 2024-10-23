// useSocket.ts
import { useContext } from "react";
import { SocketContext } from "./socketProvider"; // Adjust the path as necessary

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};
