let currentPlayer = 'X';
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
    let index =td.getAttribute('index')
    if(td.innerHTML ==''){
    td.innerHTML= currentPlayer;
    gamestate[index] = currentPlayer;

    }
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