let situation = document.getElementById("situation");
const params = new URLSearchParams(window.location.search);
const userId = params.get("userId");
const roomId = params.get("roomId");
let room = document.getElementById("room");

let user = document.getElementById("user");
let opponent = document.getElementById("opponent");

let userSymbol = document.getElementById("user-symbol");
let opponentSymbol = document.getElementById("opponent-symbol");

let Id = document.getElementById("user-id");
let opponentId = document.getElementById("opponent-id");
let GameState = [];
const ws = new WebSocket(`http://localhost:3000?userId=${userId}`);
let yoursymbol;
ws.onopen = (ev) => {
  ws.send(
    JSON.stringify({
      type: "join",
      payload: {
        userId,
        roomId,
      },
    })
  );
};

ws.onmessage = (ev) => {
  const data = JSON.parse(ev.data);
console.log(ev);

  switch (data.type) {
    case "join-failed":
      alert("Incorrect UserId or RoomId");
      // this.window.location.replace("/");
      break;
    case "room-joined":
      alert("User Joined Successfully");
      room.innerText = data.payload.roomId;
      user.innerText = data.payload.userId;
      break;
    case "start-game":
      alert(
        `Game started! Your opponent is ${data.payload.opponentName}. Your symbol: ${data.payload.yourSymbol}, Opponent's symbol: ${data.payload.opponentSymbol}`
      );
      opponentId.innerText = data.payload.opponentId;
      opponentSymbol.innerText = data.payload.opponentSymbol;
      userSymbol.innerText = data.payload.yourSymbol;
      Id.innerText = userId;
      yoursymbol = data.payload.yourSymbol;
      opponent.innerText = data.payload.opponentName;
      updateUI(data.payload.state);
      break;
    case "movement":
      console.log("GameState", data.payload.game);
      updateUI(data.payload);

      renderBoard(data.payload.game);
      break;
    default:
      break;
  }
};
function clickHandler(event) {
  let td = event.target;
  let position = Number(td.getAttribute("index"));
  console.log("position", position);
  if (GameState[position]) return;
  ws.send(
    JSON.stringify({
      type: "move",
      payload: {
        position,
      },
    })
  );
}
function renderBoard(game) {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.innerText = game[i] || "";
  });
}

function updateUI(state) {
  if (!yoursymbol) return;

  const myTurn = state.currentTurn === yoursymbol;

  if (myTurn) {
    situation.innerText = "make your move";
  } else {
    situation.innerText = "opponent is making his move";
  }

  if (state.winner) {
    situation.innerText = `winner is ${state.winner}`;
  }
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.style.pointerEvents = myTurn ? "auto" : "none";
    cell.classList.toggle("disabled", !myTurn);
  });
}

function initial() {
  var tdcells = document.getElementsByTagName("td");
  for (let i = 0; i < tdcells.length; i++) {
    tdcells[i].addEventListener("click", clickHandler);
  }
  room.innerHTML = roomId;
}
initial();
