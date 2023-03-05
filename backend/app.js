const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

app.use(express.json());

// BDD

// Cors

app.use("API/auth", userRoutes);
app.use("API/post", postRoutes);

module.exports = app;