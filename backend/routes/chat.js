const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const chatCtrl = require("../controllers/chat");

router.get("/", auth, chatCtrl.getAllPosts);
router.post("/", auth, multer, chatCtrl.createPost);
router.put("/update", auth, chatCtrl.updatePost);
router.delete("/delete", auth, chatCtrl.deleteOldestPost);

module.exports = router;
