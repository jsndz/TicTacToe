let winner = document.getElementById('winner');
const userId = new URLSearchParams(window.location.search).get('userId');
const roomId = new URLSearchParams(window.location.search).get('roomId')
console.log("game.js",roomId,userId)
let room = document.getElementById("room")
const ws =  new WebSocket(`ws://localhost:3000/${userId}`)

ws.onmessage = (ev)=>{
    // position:position,
    // user:user.username,
    // symbol:symbol
    const data  = JSON.parse(ev.data);
    gamestate[data.position] = data.symbol;
    
}
function clickHandler(){
    let td = event.target;
    let position = td.getAttribute('index')
    ws.send(JSON.stringify({
        position
    }))
}





//initial
function initial(){
    var tdcells= document.getElementsByTagName('td');
    // console.log(tdcells);
    for(i=0;i<9;i++)
    {
        tdcells[i].addEventListener('click',clickHandler);
    }
    room.innerHTML = roomId;
}
initial();


function checkwinner(){

    for (let i = 0; i < 8; i++) {

        var a= winningCondition[i][0];
        var b= winningCondition[i][1];
        var c= winningCondition[i][2];
        
        if(gamestate[a]==currentPlayer && gamestate[b]==currentPlayer && gamestate[c]==currentPlayer)
        {
            winner.innerHTML=" winner is"+ currentPlayer;

        }
    }
}
//for draw
function draw(){
    if(!gamestate.includes(''))
    {
        winner.innerHTML="DRAW";
    }
}



