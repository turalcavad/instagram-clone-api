const router = require("express").Router();
const {
	createConversation,
	getConversations,
} = require("../controllers/conversation");

router.post("/", createConversation);

router.get("/:userId", getConversations);

module.exports = router;
