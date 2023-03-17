const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signUp);
router.post("/login", userCtrl.login);
router.get("/users/:userId", auth, userCtrl.getOneUser);
router.put("/users/:userId/update", auth, userCtrl.updateUser)

module.exports = router;
