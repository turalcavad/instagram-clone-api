const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const {
	getUser,
	updateUser,
	deleteUser,
	followUser,
} = require("../controllers/user");

router.get("/", (req, res) => {
	res.send("hey its user route");
});

//update user
router.put("/:id", updateUser);

//delete user
router.delete("/:id", deleteUser);

//get user
router.get("/:id", getUser);

//follow a user
router.put("/:id/follow", followUser);

module.exports = router;
