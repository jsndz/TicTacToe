document.getElementById("join-btn").addEventListener("click",handleJoinRoom)
document.getElementById("create-btn").addEventListener("click",handleCreateRoom)

function handleCreateRoom(username){
    fetch('http://localhost:3000/rooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username :username,
        })
    })
    .then(res => res.json())
    .then((data)=>{
        window.location.replace(`/game?userId=${data.userId}`);
    })
}


function handleJoinRoom(roomID){
    fetch(`http://localhost:3000/rooms/${roomID}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username :username,
        })
    })
    .then(res => res.json())
    .then((data)=>{
        window.location.replace(`/game?userId=${data.userId}`);
    })
}
