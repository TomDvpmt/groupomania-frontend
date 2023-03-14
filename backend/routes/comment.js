// const express = require("express");
// const router = express.Router();
// const auth = require("../middlewares/auth");
// const multer = require("../middlewares/multer-config");
// const commentCtrl = require("../controllers/comment");

// router.get("/:postId", auth, commentCtrl.getAllComments);
// router.get("/:postId/:id", auth, commentCtrl.getOneComment);
// router.post("/:postId", auth, multer, commentCtrl.createComment);
// router.put("/:postId/:id", auth, multer, commentCtrl.updateComment); 
// router.delete("/:postId/:id", auth, commentCtrl.deleteComment);
// router.get("/:postId/:id/likes", auth, commentCtrl.getCommentLikes);
// router.put("/:postId/:id/like", auth, commentCtrl.likeComment);
// router.get("/:postId/:id/like/user", auth, commentCtrl.getCommentUserLike);

// module.exports = router;