const {
    getAllMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    likeMessage,
} = require("../utils/forumRequests");

const config = {
    table: "posts",
    message: "post",
    getAllLabel: "getAllPosts",
    createLabel: "createPost",
    updateLabel: "updatePost",
    deleteLabel: "deletePost",
    likeLabel: "likePost",
};

exports.getAllPosts = (req, res, next) => {
    getAllMessages(req, res, config);
};

exports.createPost = (req, res, next) => {
    createMessage(req, res, config);
};

exports.updatePost = (req, res, next) => {
    updateMessage(req, res, config);
};

exports.deletePost = (req, res, next) => {
    deleteMessage(req, res, config);
};

exports.likePost = (req, res, next) => {
    likeMessage(req, res, config);
};
