let winner = document.getElementById("winner");
const userId = new URLSearchParams(window.location.search).get("userId");
const roomId = new URLSearchParams(window.location.search).get("roomId");

let room = document.getElementById("room");

let user = document.getElementById("user");
let opponent = document.getElementById("opponent");

let userSymbol = document.getElementById("user-symbol");
let opponentSymbol = document.getElementById("opponent-symbol");

let Id = document.getElementById("user-id");
let opponentId = document.getElementById("opponent-id");

const ws = new WebSocket(`http://localhost:3000?userId=${userId}`);

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

      opponent.innerText = data.payload.opponentName;
      break;
    default:
      break;
  }
};
function clickHandler() {
  let td = event.target;
  let position = td.getAttribute("index");
  ws.send(
    JSON.stringify({
      position,
    })
  );
}

//initial
function initial() {
  var tdcells = document.getElementsByTagName("td");
  for (i = 0; i < 9; i++) {
    tdcells[i].addEventListener("click", clickHandler);
  }
  room.innerHTML = roomId;
}
initial();
