// { token: {"SocketId" , "Username"} }, in memory obj
const _socketId = "SocketId"
const _username = "Username"

class SessionTb{
    constructor(){
        this.sessionTb = {};
    }

    Add(token, socketId, username){
        let newElem = {};
        newElem[_socketId] = socketId;
        newElem[_username] = username;
        this.sessionTb[token] = newElem;
    }

    EndSession(token){
        this.Add(token, "", "");
    }

    GetSocketId(token){
        let row = this.sessionTb[token];
        if(row){
            return row[_socketId];
        }
        return ""
    }
    IsTokenThere(token){
        return this.sessionTb[token] !== undefined;
    }
}

module.exports = { SessionTb }