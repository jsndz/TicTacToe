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
  getOpponent(senderId) {
    return (
      [...room.users.values()].find((user) => user.userId !== senderId) || null
    );
  }

  broadcast( message) {
    if (this.users.size !== 2) return;

    const players = this.users;
    [...players.values].forEach((user) => {
      user.ws.send(JSON.stringify(message));
    });
  }

  move(roomID, senderId, position, symbol) {
    const user = this.getOtherUser(roomID, senderId);
    if (!user) return;
    this.rooms.get(roomID).user.ws.send(
      JSON.stringify({
        position: position,
        user: user.username,
        symbol: symbol,
      })
    );
  }
  movement(position) {}
  draw() {
    if (!gamestate.includes("")) {
      winner.innerHTML = "DRAW";
    }
  }

  checkwinner(symbol) {
    for (let i = 0; i < 8; i++) {
      var a = WinningConditions[i][0];
      var b = WinningConditions[i][1];
      var c = WinningConditions[i][2];

      if (
        gamestate[a] == symbol &&
        gamestate[b] == symbol &&
        gamestate[c] == symbol
      ) {
      }
    }
  }
}
