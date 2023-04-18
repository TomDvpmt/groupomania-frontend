const {
    getAllMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    likeMessage,
} = require("../utils/forumRequests");

const config = {
    table: "comments",
    message: "comment",
    getAllLabel: "getAllComments",
    createLabel: "createComment",
    updateLabel: "updateComment",
    deleteLabel: "deleteComment",
    likeLabel: "likeComment",
};

exports.getAllComments = (req, res, next) => {
    getAllMessages(req, res, config);
};

exports.createComment = (req, res, next) => {
    createMessage(req, res, config);
};

exports.updateComment = (req, res, next) => {
    updateMessage(req, res, config);
};

exports.deleteComment = (req, res, next) => {
    deleteMessage(req, res, config);
};

exports.likeComment = (req, res, next) => {
    likeMessage(req, res, config);
};
