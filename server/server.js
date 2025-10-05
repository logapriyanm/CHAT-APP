import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

// ------------------ Socket.io Setup ------------------
export const io = new Server(server, {
  cors: { origin: "*" },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ------------------ Middleware ------------------
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// ------------------ Routes ------------------
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// ------------------ Server Start ------------------
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database Connected");

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

export default server;
