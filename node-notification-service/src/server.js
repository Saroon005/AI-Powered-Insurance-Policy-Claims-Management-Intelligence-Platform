require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    socket.emit("welcomeNotification", {
        message: "Welcome to InsuranceIQ Notification Service"
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });

});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});