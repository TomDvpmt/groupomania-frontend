require("dotenv").config();
const http = require("http");
const app = require("./app");
const socketio = require("socket.io");

const server = http.createServer(app);

const io = socketio(server);

io.on("connection", (socket) => {
    console.log("---------- Nouvelle connexion WebSocket. -----------");

    socket.on("disconnect", () => {
        console.log("---------- Fin de connexion WebSocket -------------");
    });
});

server.listen(process.env.PORT || 3000);

console.log(`Server running on port ${process.env.PORT || 3000}`);

module.exports = server;
