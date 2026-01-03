import {  WebSocket } from "ws";

function generateId(username) {
        return username.trim() + Math.random().toFixed(2)*1000
}
function generateRoomId() {
    return  Math.random().toFixed(4)*1000
}


class Hub {
    rooms = new Map();
    static instance;
    constructor(){
        this.rooms = new Map();
    }
    static getInstance(){
        if(this.instance == null){
            this.instance = new Hub();
        }
        return this.instance;
    }
    createRoom(id) {
        this.rooms.set(id,new Map());
    }

    deleteRoom(id){
        this.rooms.delete(id)
    }

    addUser(roomId,user){
        this.rooms.get(roomId).set(user.id,user)
    }
    getUser(roomId ,userId){
        this.rooms.get(roomId).get(userId)
    }
    move(roomID,recieverId,position){
       const user = this.getUser(roomID,recieverId)

       user.ws.send(JSON.stringify({
        position:position,
        user:user.username,
       }))
    }
}



export class User{

    username = "";
    userId = "";
    
    
    roomId = "";
    constructor(username,ws){
        this.username = username;
        this.ws = new WebSocket();
        this.userId = generateId(username);
        this.EventHandler();
    }

    events(){
        this.ws.on("message",async(data)=>{
            switch (data.type) {
                case "join":
                    // check roomId and add the userId to the room 
                    // only two members are allowed
                case "create":
                    // create a room and add the user to the room id

                case "movement":
                    // take the user move and send it to the other person
            }
        })
    }

    destroy(){
        
    }

    send(payload){
        this.ws.send(payload);
    }

}