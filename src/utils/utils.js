export function generateId(username) {
    return username.trim() + Math.random().toFixed(2) * 1000;
  }
  export function generateRoomId() {
    return (Math.random().toFixed(3) * 10000).toString();
  }
  
  
  