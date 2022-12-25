const {SocketList} =  require("./repository/socket_list");
const {HistoryTb} = require("./repository/history_tb");
const {SessionTb} = require("./repository/session_tb");
const {GenUniqueToken, GenUsername} = require("./repository/common");

const socketList = new SocketList();
const sessionTb  = new SessionTb();
const historyTb = new HistoryTb();
historyTb.NewClient().catch( (err) =>{ throw err } )  

const ws = require("socket.io")({
    path: "/sayhi" 
})

ws.on("connection", (sckt)=> {
    let {token, username} = sckt.handshake.auth;
    if(!sessionTb.IsTokenThere(token)){
        token = GenUniqueToken();
        username = username || GenUsername();
        sckt.emit("add-token", token, username);
    }
    sessionTb.Add(token, sckt.id, username);
    socketList.Add(sckt.id, sckt);

    historyTb.GetAllHistory().then((results) => {
        sckt.emit("all-msgs/user", results);
    }).catch((reason) => console.error(reason));
    console.log(`connected with token : ${token}, socketId: ${sckt.id}, username: ${username}`);

    // broadcast to all online users (expect the sender). auth={token, username}
    sckt.on("msg/broadcast", (username, msg) => {
        if(username == "" || msg == "") {return}
        let list = socketList.GetSocketList();
        historyTb.InsertRow(username, msg).catch( (reason) => console.error(reason) );
        for (let onlineScktId in list){
            if(onlineScktId === sckt.id){
                continue;
            }
            let onlineSckt = socketList.Get(onlineScktId);
            onlineSckt.emit("msg/broadcast", {
                "timestamp": new Date().toLocaleString(), 
                "owner_id" : username,
                "content": msg
            });
        }
        console.log(`msg/broadcast, socketId: ${sckt.id}, username: ${username}`);
    })

    // client disconnecting logic
    sckt.on("disconnect", (reason) => {
        socketList.Delete(sckt.id);
        console.log(`socketId ${sckt.id} disconnect due to ${reason}`);
    })
    // TODO: open not disconnected sockets are still there. find a way to remove those
})

console.log("listen 8000...");
ws.listen(8000);
