let io;

const initializeSocket = (server) => {
    const { Server } = require("socket.io");
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });
    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
};

module.exports = {
    initializeSocket,
    getIO
};