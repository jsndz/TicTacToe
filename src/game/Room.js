
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
    this.GameState = IntialGameState;
    this.currentTurn = "X";
    this.winner = null;
    this.users = new Map();
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
  begin(userId) {
    if (this.users.size !== 2) return;

    const user1 = this.users.get(userId);
    user1.symbol = "X";
    const user2 = this.getOpponent(userId);
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

  movement(position, symbol) {
    this.GameState[position] = symbol;
    if(this.checkwinner(symbol)){
      this.broadcast({
        type: "movement",
        state: {
          game: this.GameState,
          currentTurn: opSymbol(symbol),
          winner: symbol,
        },
      }); 
    }
    this.broadcast({
      type: "movement",
      state: {
        game: this.GameState,
        currentTurn: opSymbol(symbol),
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
      var a = WinningConditions[i][0];
      var b = WinningConditions[i][1];
      var c = WinningConditions[i][2];

      if (
        this.GameState[a] == symbol &&
        this.GameState[b] == symbol &&
        this.GameState[c] == symbol
      ) {
        return true;
      }
      return false;
    }
  }
}
