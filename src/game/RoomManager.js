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
    this.players.set(user.userId, user);
    return { roomId, userId: user.userId };
  }
  addUser(username,roomId){
    const user = new User(username, roomId);
    this.players.set(user.userId,user);
    this.rooms.get(roomId).addUser(user)
  }

  deleteRoom(id) {
    this.rooms.delete(id);
  }

  getUser(userId) {
    return this.players.get(userId);
  }

  getOtherUser(roomId, senderId) {
    const users = this.rooms.get(roomId);
    if (!users) return null;
    return [...users.values()].find((user) => user.userId !== senderId) || null;
  }

  broadcast(roomId,message){
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
    this.rooms.get(roomID).
    user.ws.send(
      JSON.stringify({
        position: position,
        user: user.username,
        symbol: symbol,
      })
    );
  }
}
