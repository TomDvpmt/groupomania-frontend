require("dotenv").config();
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200",
    },
});

let allMessages = [];

io.on("connection", (socket) => {
    console.log(`--- Nouvelle connexion WebSocket (user id : ${socket.id} ---`);

    socket.on("sendMessagesFromDB", (messages) => {
        allMessages = [...messages];
        socket.emit("receiveAllMessages", allMessages);
    });

    socket.on("sendMessage", (message) => {
        allMessages.push(message);
        socket.broadcast.emit("receiveAllMessages", allMessages);
    });

    socket.on("disconnect", (socket) => {
        console.log(
            `--- Fin de connexion WebSocket (user id : ${socket.id} ---`
        );
    });
});

server.listen(process.env.PORT || 3000);

console.log(`Server running on port ${process.env.PORT || 3000}`);

module.exports = server;
