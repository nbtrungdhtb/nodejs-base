const express = require("express");
const cookieParser = require("cookie-parser");
const config = require("./config/appConfig");
const apiRouter = require("./routers/index");
const RequestHandler = require("./utils/RequestHandler");
const Logger = require("./utils/logger");
const db = require("./models/index");

const logger = new Logger();
const requestHandler = new RequestHandler(logger);


const cors = require("cors");

const app = express();
app.set("config", config);
app.set("db", db);
app.set("TZ", process.env.TIME_ZONE);


process.on("SIGINT", () => {
    logger.log("stopping the server", "info");
    process.exit();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.use(apiRouter);

app.all("*", function(req, res) {
    return requestHandler.notFoundResponse(res, "Page not found");
});

app.use((req, res, next) => {
    logger.log("the url you are trying to reach is not hosted on our server", "error");
    const err = new Error("Not Found");
    err.status = 404;
    res.status(err.status).json({ type: "error", message: "the url you are trying to reach is not hosted on our server" });
    next(err);
});


module.exports = app;
