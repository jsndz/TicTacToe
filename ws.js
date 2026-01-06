export function generateId(username) {
        return username.trim() + Math.random().toFixed(2)*1000
}
export function generateRoomId() {
    return  Math.random().toFixed(4)*1000
}


export class Hub {
    rooms = new Map();
    players = new Map();
    static instance;
    constructor(){
        this.rooms = new Map();
        this.players = new Map();
    }
    static getInstance(){
        if(this.instance == null){
            this.instance = new Hub();
        }
        return this.instance;
    }
    createRoom(username) {
        const roomId = generateRoomId();
        const users = new Map();
        const user = new User(username,roomId);
        user.symbol = 'X';
        this.players.set(user.userId,user)
        users.set(user.userId,user);
        this.rooms.set(roomId,users);
        return {roomId,userId:user.userId};
    }

    deleteRoom(id){
        this.rooms.delete(id)
    }

    addUser(roomId,username){
        const room = this.rooms.get(roomId);
        if(!room){
            return;
        }
        const user = new User(username,roomId)
        user.symbol = 'O';
        if (room.size >= 2) {
        //   user.send(JSON.stringify({ error: "Room full" }));
          return;
        }  
        this.players.set(user.userId,user)
        room.set(user.userId, user);
        return user.userId;
    }
    getUser(userId){
        return this.players.get(userId);
    }
    getOtherUser(roomId,senderId){
        const users = this.rooms.get(roomId);
        if (!users) return null;

        return [...users.values()].find(
            user => user.userId !== senderId
          ) || null;
    }
    move(roomID,senderId,position,symbol){
        const user = this.getOtherUser(roomID,senderId);
        if (!user) return;
        user.ws.send(JSON.stringify({
            position:position,
            user:user.username,
            symbol:symbol
        }))
    }
}



export class User{

    username = "";
    userId = "";
    roomId = "";
    ws;
    symbol="";
    constructor(username,roomId){
        this.username = username;
        this.ws = null;
        this.symbol = "";
        this.roomId = roomId;
        this.userId = generateId(username);
        
    }

    attachWs(ws){
        this.ws = ws;
        ws.user = this;
        ws.on("message",async(raw)=>{
            let data;
            try {
              data = JSON.parse(raw.toString());
            } catch(error) {
                console.log(error)
              return;
            }
            
            switch (data.type) {
                case "movement":
                    // take the user move and send it to the other person
                    if (!this.roomId) return;

                    Hub.getInstance().move(this.roomId,this.userId,data.payload.position,this.symbol);
                    break;

            }
        })
        ws.on("close", () => this.destroy());

    }

    destroy()
    {
        const hub = Hub.getInstance();
        const room = hub.rooms.get(this.roomId);
        if (!room) return;
        hub.players.delete(this.userId)
        room.delete(this.userId);
        if (room.size === 0) {
        hub.deleteRoom(this.roomId);
    }
        
    }

    send(payload){
        this.ws.send(payload);
    }

}