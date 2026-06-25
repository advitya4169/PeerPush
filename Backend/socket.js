import { Server } from "socket.io";

let io;

export const initSocket = (server) =>{
    io = new Server(server,{
        cors:{
            origin:"http://localhost:5173",
            methods:["GET","POST"],
        },
    });
    io.on("connection",(socket)=>{
        console.log("User connected:",socket.id);
        socket.on("join-pair",(pairId)=>{
            socket.join(pairId);
            console.log(`Socket ${socket.id} joined pair ${pairId}`);
        });
        socket.on("disconnect",()=>{
        console.log("User Disconnected:",socket.id);
    });
    }); 
    return io;
}

export const getIO = () =>{
    if(!io)
        throw new Error("Socket.io not initialized");
    return io;
}