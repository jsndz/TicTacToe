document.getElementById("join-btn").addEventListener("click", handleJoinRoom);
document
  .getElementById("create-btn")
  .addEventListener("click", handleCreateRoom);

function handleCreateRoom() {
  const username = document.getElementById("create-name").value;

  fetch("http://localhost:3000/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      return data;
    })
    .then((data) => {
      console.log(data);

      window.location.replace(
        `/game?userId=${data.userId}&roomId=${data.roomId}`
      );
    })
    .catch((err) => {
      console.log(err);

      alert(err);
    });
}

function handleJoinRoom() {
  const username = document.getElementById("join-name").value;
  const roomID = document.getElementById("join-code").value;

  if (!username || !roomID) return;
  fetch(`http://localhost:3000/rooms/${roomID}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      return data;
    })
    .then((data) => {
      window.location.replace(
        `/game?userId=${data.userId}&roomId=${data.roomId}`
      );
    })
    .catch((err) => alert(err));
}
