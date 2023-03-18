const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signUp);
router.post("/login", userCtrl.login);
router.get("/:userId", auth, userCtrl.getOneUser);
router.put("/:userId", auth, userCtrl.updateUser);
router.delete("/:userId", auth, userCtrl.deleteUser);

module.exports = router;
