import { Server, Socket } from "socket.io";
import { verifyToken } from "../services/jwtService";
import { NextFunction } from "express";

export const userSocketMap: Record<string, string[]> = {};

const authenticateSocket = (socket: Socket, next: NextFunction) => {
  const cookies = socket.handshake.headers.cookie;
  const idToken = cookies
    ?.split(";")
    .find((c: string) => c.trim().startsWith("jwt="))
    ?.split("=")[1];

  if (!idToken) {
    return next(new Error("No Access Token Found"));
  }

  try {
    const tokenData = verifyToken(idToken);
    if (!tokenData || !tokenData.id) {
      return next(new Error("Invalid Token"));
    }

    socket.userId = tokenData.id;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
};

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [process.env.VITE_ADDRESS as string],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log("New Socket.IO connection:", socket.id);

    const userId = socket.userId;
    if (userId) {
      if (userSocketMap[userId]) {
        userSocketMap[userId].push(socket.id);
      } else {
        userSocketMap[userId] = [socket.id];
      }
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    }

    socket.on("message", (message) => {
      console.log("Received:", message);
      io.emit("newMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO connection closed:", socket.id);
      if (userId) {
        userSocketMap[userId] = userSocketMap[userId].filter(
          (id) => id !== socket.id
        );

        if (userSocketMap[userId].length === 0) {
          delete userSocketMap[userId];
        }
      }
    });
  });

  return io;
};
