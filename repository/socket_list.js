// {socketId, socketObj}, socketId must be unique. in memory object
// this will keep track of online users
class SocketList{
    constructor(){
        this.socketList = {};
    }

    Add(socketId, socketObj){
        this.socketList[socketId] = socketObj;
    }

    Delete(socketId){
        return delete this.socketList[socketId] ;
    }

    Get(socketId){
        return this.socketList[socketId] ;
    }

    GetSocketList(){
        return this.socketList
    }

}

module.exports = {SocketList} 