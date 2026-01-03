import express from "express";
import path from "path";
import http from "http"
import {  WebSocketServer } from "ws";
import { User } from "./ws";
const app = express();

const server = http.createServer(app);
const wss = new WebSocketServer({server})

app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "public/index.html"));
});
app.get("/game", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "public/game.html"));
  wss.on("connection",(ws)=>{
    let user = new User(req.query.name,ws);

    ws.on("close",()=>{
      user.destroy();
    })
  })
});



app.listen(3000, () => {
  console.log("Server running in 3000");
});
