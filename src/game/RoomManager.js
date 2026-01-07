import { User } from "./User.js";

const WinningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const IntialGameState = ["", "", "", "", "", "", "", "", ""];
export class Hub {
  rooms = new Map();
  players = new Map();
  static instance;
  constructor() {
    this.rooms = new Map();
    this.players = new Map();
  }
  static getInstance() {
    if (this.instance == null) {
      this.instance = new Hub();
    }
    return this.instance;
  }
  createRoom(username) {
    const roomId = generateRoomId();
    const users = new Map();
    const user = new User(username, roomId);
    user.symbol = "X";
    this.players.set(user.userId, user);
    users.set(user.userId, user);
    this.rooms.set(roomId, users);
    return { roomId, userId: user.userId };
  }

  deleteRoom(id) {
    this.rooms.delete(id);
  }
  
  addUser(roomId, username) {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(" Room not found:", roomId);
      return;
    }
    if (room.size >= 2) {
      console.log(" Room is full");
      return;
    }

    const user = new User(username, roomId);
    user.symbol = "O";

    if (!this.players) {
      console.error("players map is not initialized");
      return;
    }

    this.players.set(user.userId, user);
    room.set(user.userId, user);

    return {
      roomId,
      userId: user.userId,
    };
  }

  getUser(userId) {
    return this.players.get(userId);
  }
  getOtherUser(roomId, senderId) {
    const users = this.rooms.get(roomId);
    if (!users) return null;

    return [...users.values()].find((user) => user.userId !== senderId) || null;
  }
  checkwinner(symbol){
    for (let i = 0; i < 8; i++) {

        var a= WinningConditions[i][0];
        var b= WinningConditions[i][1];
        var c= WinningConditions[i][2];
        
        if(gamestate[a]==symbol && gamestate[b]==symbol && gamestate[c]==symbol)
        {
            

        }
    }
  }

  broadcast(roomId){
    const players = this.rooms.get(roomId);

    [...players.values].forEach(user => {
      user.ws.send(
        JSON.stringify()
      )
    });
  }
  move(roomID, senderId, position, symbol) {
    const user = this.getOtherUser(roomID, senderId);
    if (!user) return;
    user.ws.send(
      JSON.stringify({
        position: position,
        user: user.username,
        symbol: symbol,
      })
    );
  }
}
