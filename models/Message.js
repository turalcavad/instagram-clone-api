const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
	{
		conversationId: { type: String },
		sentBy: { type: mongoose.Types.ObjectId, ref: "User" },
		text: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
