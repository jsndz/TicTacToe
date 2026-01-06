let winner = document.getElementById('winner');
let gamestate =['','','','','','','','',''];
let winningCondition =
[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]



const userId = new URLSearchParams(window.location.search).get('userId');

const ws =  new WebSocket(`ws://localhost:3000/${userId}`)

ws.onmessage = (ev)=>{
    // position:position,
    // user:user.username,
    // symbol:symbol
    const data  = JSON.parse(ev.data);
    gamestate[data.position] = data.symbol;
    
}


//initial
function initial(){
    var tdcells= document.getElementsByTagName('td');
    console.log(tdcells);
    for(i=0;i<9;i++)
    {
        tdcells[i].addEventListener('click',clickHandler);
    }
}
initial();


//handle the click
function clickHandler(){
    let td = event.target;
    let position = td.getAttribute('index')
    ws.send(JSON.stringify({
        position
    }))
    checkwinner();
    draw();
    changePlayer();
    
}
function changePlayer()
{
    currentPlayer = currentPlayer =='X'?'O':'X';
}
//chech for win 
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



