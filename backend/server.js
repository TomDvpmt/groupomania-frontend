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
let loggedUsers = [];

io.on("connection", (socket) => {
    console.log(`--- Nouvelle connexion WebSocket (user id : ${socket.id} ---`);

    socket.on("sendUserData", (user) => {
        user = { ...user, socketId: socket.id };
        const isAlreadyLogged = loggedUsers.find((item) => item.id === user.id);
        !isAlreadyLogged && loggedUsers.push(user);
        io.emit("receiveLoggedUsers", loggedUsers);
    });

    socket.on("sendMessagesFromDB", (messages) => {
        console.log("receives socket message from client");
        allMessages = [...messages];
        socket.emit("receiveAllMessages", allMessages);
    });

    socket.on("sendMessage", (message) => {
        allMessages.push(message);
        socket.broadcast.emit("receiveAllMessages", allMessages);
    });

    socket.on("disconnect", () => {
        loggedUsers = loggedUsers.filter((user) => user.socketId !== socket.id);
        io.emit("receiveLoggedUsers", loggedUsers);
        console.log(
            `--- Fin de connexion WebSocket (user id : ${socket.id} ---`
        );
    });
});

server.listen(process.env.PORT || 3000);

console.log(`Server running on port ${process.env.PORT || 3000}`);

module.exports = server;
