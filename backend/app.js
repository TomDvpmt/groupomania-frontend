const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
require('dotenv').config();


// Database connection

const {initializeDbConnection} = require("./database/db-connect");
initializeDbConnection();


// Routes

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
})

app.use("/API/auth", userRoutes);
app.use("/API/post", postRoutes);

module.exports = app;