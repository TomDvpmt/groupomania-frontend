const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const postCtrl = require("../controllers/post");

router.get("/", auth, postCtrl.getAllPosts);
router.get("/:id", auth, postCtrl.getOnePost);
router.post("/", auth, multer, postCtrl.createPost);
router.put("/:id", auth, multer, postCtrl.updatePost); // admin authorization
router.delete("/:id", auth, postCtrl.deletePost); // admin authorization
router.post("/:id/like", auth, postCtrl.likePost);

module.exports = router;
