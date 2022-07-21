const router = require("express").Router();
const { createNewMessage, getMessages } = require("../controllers/message");

router.post("/", createNewMessage);

router.get("/:conversationId", getMessages);

module.exports = router;
