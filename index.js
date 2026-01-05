import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer } from "ws";
import { Hub, User } from "./ws";
const app = express();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "public/index.html"));
});

app.get("/game", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "public/game.html"));
});

app.get("/create:username", (req, res) => {
  const {userId,roomId} =  Hub.getInstance().createRoom(req.params.username);
  res.send(JSON.stringify({ message: "Created room" ,room : roomId, user:userId }));
});

app.get("/join:roomId", (req, res) => {
  if (this.roomId) {
    res.send(JSON.stringify({ message: "Room Doesn't Exist"}));
    return;
  }
  const userId = Hub.getInstance().addUser(req.params.roomId,req.params.username);
  res.send(JSON.stringify({ message: "Joined room" ,room : roomId, user:userId }));
});


wss.on("connection", (ws) => {
  const params = new URL(req.url, "http://localhost").searchParams;
  const userId = params.get("userId");
  const roomId = params.get("roomId");

  const user = Hub.getInstance().getUser(roomId,userId);
  if (!user) {
    ws.close();
    return;
  }

  user.attachWs(ws);
  ws.on("close", () => {
    ws.user.destroy();
  });
});

app.listen(3000, () => {
  console.log("Server running in 3000");
});
