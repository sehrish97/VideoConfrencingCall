const express = require("express");
const app = express();
const socket = require("socket.io")
const http = require('http');
const server = http.createServer(app);
const io = socket(server);
const port = 3001;





app.get("/",(req,res)=>{
    res.send("hello world")
})

 io.on("connection", (socket)=>{
    console.log("someone is connected");
    socket.emit("me",socket.id)
    // socket.on("join_room", ({ userName,roomId})=>{
    //     console.log("user joind room");
    //     const p_user = 
    //     console.log(roomId);
    //     console.log(userName);
    // })
    socket.on("disconnected",()=>{
        socket.broadcast.emit("callEnded");
    })
    socket.on("callUser",(data)=>{
        io.to(data.userToCall).emit("callUser",{signal:data.signalData,from: data.from,name:data.name})
    })
    socket.on("answerCall",(data)=>{
        io.to(data.to).emit("callAccepted",data.signal)
    })
 })
 server.listen(port, ()=>{
    console.log(`Meeting is on port ${port}`);
});

