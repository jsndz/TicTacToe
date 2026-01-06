import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer } from "ws";
import { Hub } from "./ws.js";
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

  const result = hub.joinRoom(roomId, username);
  if (!result) {
    res.status(400).json({ error: "Room not found or full" });
    return;
  }

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
