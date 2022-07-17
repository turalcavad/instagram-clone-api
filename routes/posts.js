const router = require("express").Router();
const { requireSignin } = require("../controllers/auth");
const {
	createPost,
	feed,
	likePost,
	unlikePost,
	comment,
	getPost,
} = require("../controllers/post");
const { userById } = require("../controllers/user");

router.post("/new/:userId", createPost);

router.get("/post/:postId", getPost);

router.get("/feed/:userId", feed);

router.put("/like/:postId", likePost);

router.put("/unlike/:postId", unlikePost);

router.post("/comment", comment);

router.param("userId", userById);

module.exports = router;
