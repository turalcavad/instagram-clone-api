const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
	{
		members: [
			(senderId = { type: mongoose.Types.ObjectId, ref: "User" }),
			(receiverId = { type: mongoose.Types.ObjectId, ref: "User" }),
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
