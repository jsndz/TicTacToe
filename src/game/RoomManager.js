import { generateRoomId } from "../utils/utils.js";
import { Room } from "./Room.js";
import { User } from "./User.js";

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
    const user = new User(username, roomId);
    const room = new Room(roomId);
    room.addUser(user);

    this.rooms.set(roomId, room);
    this.players.set(user.userId, user);
    return { roomId, userId: user.userId };
  }
  addUser(username, roomId) {
    
    const user = new User(username, roomId);
    this.players.set(user.userId, user);
    const room = this.rooms.get(roomId);
    if(!room) return;

    room.addUser(user);
    return { roomId, userId: user.userId };
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  deleteRoom(id) {
    this.rooms.delete(id);
  }

  getUser(userId) {
    return this.players.get(userId);
  }
}
