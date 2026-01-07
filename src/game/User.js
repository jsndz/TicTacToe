
export class User {
    username = "";
    userId = "";
    roomId = "";
    ws;
    symbol = "";
    constructor(username, roomId) {
      this.username = username;
      this.ws = null;
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
          console.log(error);
          return;
        }
  
        switch (data.type) {
          case "movement":
            // take the user move and send it to the other person
            if (!this.roomId) return;
  
            Hub.getInstance().move(
              this.roomId,
              this.userId,
              data.payload.position,
              this.symbol
            );
            break;
          case "result":
            break;
          
        }
      });
      ws.on("close", () => this.destroy());
    }
  
    destroy() {
      const hub = Hub.getInstance();
      const room = hub.rooms.get(this.roomId);
      if (!room) return;
      hub.players.delete(this.userId);
      room.delete(this.userId);
      if (room.size === 0) {
        hub.deleteRoom(this.roomId);
      }
    }
  
    send(payload) {
      this.ws.send(payload);
    }
  }
  