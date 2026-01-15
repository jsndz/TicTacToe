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

  const result = hub.addUser(username, roomId);
  
  if (!result) {
    res.status(400).json({ error: "Room not found or full" });
    return;
  }

  res.json(result);
});

wss.on("connection", (ws, req) => {
  console.log("WebSocket connection established, URL:", req.url);

  const params = new URL(req.url, "http://localhost").searchParams;
  const userId = params.get("userId");

  console.log("Extracted userId:", userId);
  console.log("All players in hub:", [...hub.players.keys()]);

  const user = hub.getUser(userId);

  if (!user) {
    console.log("User not found, closing connection");
    ws.close(1008, "User not registered");
    return;
  }

  user.attachWs(ws);
});

server.listen(3000, () => {
  console.log("Server running in http://localhost:3000");
});
