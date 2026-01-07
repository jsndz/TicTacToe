import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer } from "ws";
import { Hub } from "./src/game/RoomManager.js";
const app = express();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const hub = Hub.getInstance();


app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "public/index.html"));
});

app.get("/game", (req, res) => {
  const {roomId, userId} = req.query;
  console.log("/game",userId, roomId); 
  res.sendFile(path.join(import.meta.dirname, "public/game.html"));
});

app.post("/rooms", (req, res) => {
  const { username } = req.body;
  if (!username) {
    res.status(400).json({ error: "username required" });
    return;
  }

  const result = hub.createRoom(username);
  res.json(result);
});

app.post("/rooms/:roomId/join", (req, res) => {
  const { username } = req.body;
  const { roomId } = req.params;
console.log("/rooms/:roomId/join",username,roomId);

  const result = hub.addUser(roomId, username);
  
  if (!result) {
    res.status(400).json({ error: "Room not found or full" });
    return;
  }
  console.log("result",result);

  res.json(result);
});


wss.on("connection", (ws,req) => {
  const params = new URL(req.url, "http://localhost").searchParams;
  const userId = params.get("userId");

  const user = hub.getUser(userId);
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
  console.log("Server running in http://localhost:3000");
});
