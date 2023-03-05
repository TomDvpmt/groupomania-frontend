const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const postCtrl = require("../controllers/post");

router.get("/", postCtrl.getAllPosts);
router.get("/:id", postCtrl.getOnePost);
router.post("/", postCtrl.createPost);
router.put("/:id", postCtrl.updatePost); // admin authorization
router.delete("/:id", postCtrl.deletePost); // admin authorization
router.post("/:id/like", postCtrl.likePost);

module.exports = router;
