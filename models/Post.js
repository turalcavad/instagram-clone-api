const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		max: 300,
	},
	photo: {
		type: Buffer,
		contentType: String,
	},
	postedBy: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
	},
	created: {
		type: Date,
		default: Date.now,
	},
	updated: Date,
	likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
	comments: [
		{
			text: String,
			created: { type: Date, default: Date.now },
			postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
		},
	],
});

module.exports = mongoose.model("Post", PostSchema);
