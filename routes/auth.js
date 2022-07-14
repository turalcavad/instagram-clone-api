const router = require("express").Router();
const { register, login, signout } = require("../controllers/auth");
const { userById } = require("../controllers/user");

//REGISTER
router.post("/register", register);

//LOGIN
router.post("/login", login);

//SIGNOUT
router.post("/signout", signout);

router.param("userId", userById);

module.exports = router;
