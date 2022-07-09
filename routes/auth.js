const router = require("express").Router();
const { register, login, signout } = require("../controllers/auth");

//REGISTER
router.post("/register", register);

//LOGIN
router.post("/login", login);

//SIGNOUT
router.post("/signout", signout);

module.exports = router;
