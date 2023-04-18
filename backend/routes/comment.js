const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const commentCtrl = require("../controllers/comment");

router.get("/all/:parentId", auth, commentCtrl.getAllComments);
router.post("/", auth, multer, commentCtrl.createComment);
router.put("/:id", auth, multer, commentCtrl.updateComment);
router.delete("/:id", auth, commentCtrl.deleteComment);
router.put("/:id/like", auth, commentCtrl.likeComment);

module.exports = router;
