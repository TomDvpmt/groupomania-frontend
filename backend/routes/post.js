const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const postCtrl = require("../controllers/post");

router.get("/all/:parentId", auth, postCtrl.getAllPosts);
// router.get("/:id", auth, postCtrl.getOnePost);
router.post("/", auth, multer, postCtrl.createPost);
router.put("/:id", auth, multer, postCtrl.updatePost); 
router.delete("/:id", auth, postCtrl.deletePost);

// router.get("/:id/likes", auth, postCtrl.getPostLikes);
router.put("/:id/like", auth, postCtrl.likePost);
// router.get("/:id/like/user", auth, postCtrl.getPostUserLike);

// router.get("/:id/comments", auth, postCtrl.getAllComments);
// router.post("/:id/comments/:commentId", auth, postCtrl.createComment);

module.exports = router;
