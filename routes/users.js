const router = require("express").Router();
const {
	getUser,
	updateUser,
	deleteUser,
	followUser,
	unfollowUser,
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

//follow user
router.put("/:id/follow", followUser);

//unfollow user
router.put("/:id/unfollow", unfollowUser);

module.exports = router;
