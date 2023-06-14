require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");
const chatRoutes = require("./routes/chat");
const path = require("path");
const dbSetUp = require("./database/db-setup-mysql");

dbSetUp();

// Routes

app.use(express.json());
app.use(cors());

app.use("/API/auth", userRoutes);
app.use("/API/posts", postRoutes);
app.use("/API/comments", commentRoutes);
app.use("/API/chat", chatRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
