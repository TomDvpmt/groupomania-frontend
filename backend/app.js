require("dotenv").config();
const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");
const chatRoutes = require("./routes/chat");
const path = require("path");
const dbSetUp = require("./database/db-setup-mysql");

dbSetUp();

// // Database connection with sequelize
// const {initializeDbConnection} = require("./database/db-connect-sequelize");
// initializeDbConnection();

// Routes

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.use("/API/auth", userRoutes);
app.use("/API/posts", postRoutes);
app.use("/API/comments", commentRoutes);
app.use("/API/chat", chatRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
