// socketProvider.js
import { createContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSocketId } from "../../store/slices/socketSlice";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  console.log("Initializing socket connection...");
  const socket = io("http://localhost:3000", { withCredentials: true });
  const dispatch = useDispatch();

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to socket");
      console.log("Here's your socket ID:", socket.id);
      dispatch(setSocketId(socket.id ?? null));
    };

    const handleDisconnect = () => {
      console.log("Disconnected from socket");
      dispatch(setSocketId(null));
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      console.log("Cleaning up socket...");
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [socket, dispatch]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext };
