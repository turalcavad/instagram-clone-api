const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		max: 300,
	},
	imagePath: {
		type: String,
		required: true,
		max: 300,
	},
	postedBy: {
		type: mongoose.Types.ObjectId,
		ref: "User",
	},
	created: {
		type: Date,
		default: Date.now,
	},
	updated: Date,
	likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
	comments: [
		{
			text: { type: String, required: true },
			created: { type: Date, default: Date.now },
			postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
		},
	],
});

module.exports = mongoose.model("Post", PostSchema);
