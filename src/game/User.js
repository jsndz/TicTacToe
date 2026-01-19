import { generateId } from "../utils/utils.js";
import { Hub } from "./RoomManager.js";

export class User {
  constructor(username, roomId) {
    this.username = username;
    this.ws = null;
    this.room = null;
    this.symbol = "";
    this.roomId = roomId;
    this.userId = generateId(username);
  }

  attachWs(ws) {
    this.ws = ws;
    ws.user = this;
    ws.on("message", async (raw) => {
      let data;
      try {
        data = JSON.parse(raw.toString());
      } catch (error) {
        return;
      }

      switch (data.type) {
        case "join":
          if (
            data.payload.userId !== this.userId ||
            data.payload.roomId !== this.roomId
          ) {
            this.ws.send(
              JSON.stringify({
                type: "join-failed",
              })
            );
            this.destroy();
            return;
          }
          this.ws.send(
            JSON.stringify({
              type: "room-joined",
              payload: {
                userId: this.userId,
                roomId: this.roomId,
                
              },
            })
          );
          const room = Hub.getInstance().getRoom(this.roomId);
          this.room = room;
          room.begin();

          break;

        case "move":
          // take the user move and send it to the other person
          if (!this.roomId) {
            return;
          }
          this.room.movement(data.payload.position,this.symbol)
          break;

     
      }
    });
    ws.on("close", () => {
      this.destroy();
    });
  }

  destroy() {
    const hub = Hub.getInstance();
    const room = hub.rooms.get(this.roomId);
    if (!room) {
      return;
    }
    hub.players.delete(this.userId);
    room.removeUser(this.userId);
    if (room.users.size === 0) {
      hub.deleteRoom(this.roomId);
    }
  }

  send(payload) {
    let logPayload;
    try {
      logPayload = typeof payload === 'string' ? payload : JSON.parse(payload.toString());
    } catch (e) {
      logPayload = payload.toString();
    }
    this.ws.send(payload);
  }
}
