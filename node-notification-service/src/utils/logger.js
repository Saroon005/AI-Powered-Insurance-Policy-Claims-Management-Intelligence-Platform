const logNotification = (event, payload) => {

    console.log(`
    ===================================
    EVENT: ${event}
    MESSAGE: ${payload.message}
    TIME: ${new Date()}
    ===================================
    `);

};

module.exports = {
    logNotification
};