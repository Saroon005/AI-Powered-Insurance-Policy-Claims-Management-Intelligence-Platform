const express = require("express");
const cors = require("cors");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/notify", notificationRoutes);

app.get("/", (req, res) => {
    res.send("Notification Service Running");
});




module.exports = app;