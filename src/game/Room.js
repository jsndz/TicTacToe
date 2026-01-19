
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
    console.log("[Room] Creating room", { roomId });
    this.roomId = roomId;
    this.GameState = IntialGameState;
    this.currentTurn = "X";
    this.winner = null;
    this.users = new Map();
  }

  addUser(user) {
    console.log("[Room] Adding user to room", {
      roomId: this.roomId,
      userId: user.userId,
      username: user.username,
    });
    this.users.set(user.userId, user);
  }

  removeUser(userId) {
    console.log("[Room] Removing user from room", {
      roomId: this.roomId,
      userId,
    });
    this.users.delete(userId);
  }

  getOpponent(senderId) {
    console.log("[Room] Getting opponent", {
      roomId: this.roomId,
      senderId,
      userCount: this.users.size,
    });
    return (
      [...this.users.values()].find((user) => user.userId !== senderId) || null
    );
  }

  begin(userId) {
    console.log("[Room] Begin game request", {
      roomId: this.roomId,
      userId,
      userCount: this.users.size,
    });
    if (this.users.size !== 2) return;

    const user1 = this.users.get(userId);
    user1.symbol = "X";
    const user2 = this.getOpponent(userId);
    user2.symbol = "O";

    console.log("[Room] Starting game", {
      roomId: this.roomId,
      user1: { userId: user1.userId, username: user1.username, symbol: user1.symbol },
      user2: { userId: user2.userId, username: user2.username, symbol: user2.symbol },
      currentTurn: this.currentTurn,
    });

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
    console.log("[Room] Broadcasting message", {
      roomId: this.roomId,
      userCount: this.users.size,
      messageType: message && message.type,
    });
    const players = this.users;
    [...players.values()].forEach((user) => {
      user.ws.send(JSON.stringify(message));
    });
  }

  movement(position, symbol) {
    console.log("[Room] Movement received", {
      roomId: this.roomId,
      position,
      symbol,
      currentTurn: this.currentTurn,
    });

    this.GameState[position] = symbol;

    if (this.checkwinner(symbol)) {
      console.log("[Room] Winner detected", {
        roomId: this.roomId,
        symbol,
        gameState: this.GameState,
      });
      this.broadcast({
        type: "movement",
        state: {
          game: this.GameState,
          currentTurn: opSymbol(symbol),
          winner: symbol,
        },
      });
      return;
    }

    console.log("[Room] Broadcasting movement update", {
      roomId: this.roomId,
      nextTurn: opSymbol(symbol),
      gameState: this.GameState,
    });

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
    console.log("[Room] Checking winner", {
      roomId: this.roomId,
      symbol,
      gameState: this.GameState,
    });

    for (let i = 0; i < 8; i++) {
      const a = WinningConditions[i][0];
      const b = WinningConditions[i][1];
      const c = WinningConditions[i][2];

      if (
        this.GameState[a] == symbol &&
        this.GameState[b] == symbol &&
        this.GameState[c] == symbol
      ) {
        console.log("[Room] Winning condition met", {
          roomId: this.roomId,
          symbol,
          condition: WinningConditions[i],
        });
        return true;
      }
    }

    return false;
  }
}
