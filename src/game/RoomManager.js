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
    console.log(`[RoomManager] Creating room for user: ${username}`);
    const roomId = generateRoomId();
    console.log(`[RoomManager] Generated roomId: ${roomId}`);
    const user = new User(username, roomId);
    console.log(`[RoomManager] Created user with userId: ${user.userId}`);
    const room = new Room(roomId);
    console.log(`[RoomManager] Created room: ${roomId}`);
    room.addUser(user);
    console.log(`[RoomManager] Added user to room: ${roomId}`);
    this.rooms.set(roomId,room);
    console.log(`[RoomManager] Stored room in rooms map. Total rooms: ${this.rooms.size}`);
    this.players.set(user.userId, user);
    console.log(`[RoomManager] Stored user in players map. Total players: ${this.players.size}`);
    console.log(`[RoomManager] Room creation complete. Returning roomId: ${roomId}, userId: ${user.userId}`);
    return { roomId, userId: user.userId };
  }
  addUser(username,roomId){
    console.log(`[RoomManager] Adding user: ${username} to room: ${roomId}`);
    const user = new User(username, roomId);
    console.log(`[RoomManager] Created user with userId: ${user.userId}`);
    this.players.set(user.userId,user);
    console.log(`[RoomManager] Added user to players map. Total players: ${this.players.size} ${typeof(roomId)}`);
    const room = this.rooms.get(roomId);
    console.log(`[RoomManager] got room: ${room}}`);

    room.addUser(user);
    console.log(`[RoomManager] Added user to room: ${roomId}`);
    return { roomId, userId: user.userId };
  }
  
  getRoom(roomId){
    return this.rooms.get(roomId);
  }

  deleteRoom(id) {
    this.rooms.delete(id);
  }

  getUser(userId) {
    return this.players.get(userId);
  }

 
}
