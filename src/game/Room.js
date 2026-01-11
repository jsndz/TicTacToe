

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
    constructor(roomId){
        this.roomId = roomId;
        this.GameState = IntialGameState;
        this.currentTurn = 'X';
        this.winner = null;
        this.users = new Map();
    }
    addUser(user) {
        this.users.set(user.userId, user);
    }

    movement(position){

    }
    draw(){
        if(!gamestate.includes(''))
        {
            winner.innerHTML="DRAW";
        }
    }
    
    
    checkwinner(symbol){
        for (let i = 0; i < 8; i++) {
    
            var a= WinningConditions[i][0];
            var b= WinningConditions[i][1];
            var c= WinningConditions[i][2];
            
            if(gamestate[a]==symbol && gamestate[b]==symbol && gamestate[c]==symbol)
            {
                
            }
        }
    }
}
