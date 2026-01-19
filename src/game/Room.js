import { opSymbol } from "../utils/utils.js";

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
export class Room {
  constructor(roomId) {
    this.roomId = roomId;
    this.GameState = [...IntialGameState];
    this.currentTurn = "X";
    this.winner = null;
    this.users = new Map();
    this.started = false;
  }

  addUser(user) {

    this.users.set(user.userId, user);
  }

  removeUser(userId) {

    this.users.delete(userId);
  }

  getOpponent(senderId) {
 
    return (
      [...this.users.values()].find((user) => user.userId !== senderId) || null
    );
  }

  begin() {
    if (this.started) return;
    if (!this.areBothUsersConnected()) return;
    this.started = true;

    const [user1, user2] = [...this.users.values()];
    user1.symbol = "X";

    user2.symbol = "O";

   

    user1.ws.send(
      JSON.stringify({
        type: "start-game",
        payload: {
          opponentId: user2.userId,
          opponentName: user2.username,
          yourSymbol: user1.symbol,
          opponentSymbol: user2.symbol,
          state: { currentTurn: this.currentTurn, game: this.GameState },
        },
      })
    );
    user2.ws.send(
      JSON.stringify({
        type: "start-game",
        payload: {
          opponentId: user1.userId,
          opponentName: user1.username,
          yourSymbol: user2.symbol,
          opponentSymbol: user1.symbol,
          state: { currentTurn: this.currentTurn, game: this.GameState },
        },
      })
    );
  }

  broadcast(message) {

    const players = this.users;
    [...players.values()].forEach((user) => {
      user.ws.send(JSON.stringify(message));
    });
  }
  areBothUsersConnected() {
    if (this.users.size !== 2) return false;

    for (const user of this.users.values()) {
      if (user.ws === null) return false;
    }

    return true;
  }

  movement(position, symbol) {
    if (!this.started || this.winner) return;
    if (this.currentTurn !== symbol) return;
    if (this.GameState[position] !== "") return;
  
    this.GameState[position] = symbol;
  
    if (this.checkwinner(symbol)) {
      this.winner = symbol;
      this.broadcast({
        type: "movement",
        payload: {
          game: this.GameState,
          currentTurn: null,
          winner: symbol,
        },
      });
      return;
    }
  
    this.currentTurn = opSymbol(symbol);
  
    this.broadcast({
      type: "movement",
      payload: {
        game: this.GameState,
        currentTurn: this.currentTurn,
      },
    });
  }
  

  // draw() {
  //   if (!gamestate.includes("")) {
  //     winner.innerHTML = "DRAW";
  //   }
  // }

  checkwinner(symbol) {

    for (let i = 0; i < 8; i++) {
      const a = WinningConditions[i][0];
      const b = WinningConditions[i][1];
      const c = WinningConditions[i][2];

      if (
        this.GameState[a] == symbol &&
        this.GameState[b] == symbol &&
        this.GameState[c] == symbol
      ) {
   
        return true;
      }
    }

    return false;
  }
}
