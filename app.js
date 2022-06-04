require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var mqttHandler = require("./controllers/mqtt_handler");

const routes = require("./routes/index");
const visualRoutes = require("./routes/visualRoutes");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mqttHandler.readTopic();
app.use("/api", routes);
app.use("/", visualRoutes);

module.exports = app;
