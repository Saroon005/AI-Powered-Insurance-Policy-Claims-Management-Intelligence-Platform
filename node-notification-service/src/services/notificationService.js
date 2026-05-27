const { getIO } = require("../config/socket");
const { logNotification } = require("../utils/logger");

const sendNotification = (room, event, payload) => {

    const io = getIO();

    io.to(room).emit(event, payload);

    console.log(`[NOTIFICATION SENT]
    Room: ${room}
    Event: ${event}`);
    logNotification(event, payload);

};

module.exports = {
    sendNotification
};