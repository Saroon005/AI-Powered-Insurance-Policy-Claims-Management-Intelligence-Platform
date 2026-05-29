require("dotenv").config();

const http = require("http");

const app = require("./app");

const { initializeSocket } = require("./config/socket");
const startRenewalScheduler = require("./services/renewalScheduler");
const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

const io = initializeSocket(server);

io.on("connection", (socket) => {

    console.log(`[SOCKET CONNECTED] ${socket.id}`);

    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`${socket.id} joined ${room}`);

    });

    socket.on("disconnect", () => {
        console.log(`[SOCKET DISCONNECTED] ${socket.id}`);
    });
});

startRenewalScheduler();

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});