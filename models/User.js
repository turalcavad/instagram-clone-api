const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			min: 3,
			max: 20,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			max: 20,
			unique: true,
		},
		fullName: {
			type: String,
			required: true,
			max: 20,
		},
		password: {
			type: String,
			required: true,
			min: 6,
		},
		profilePicture: {
			type: String,
			default: "",
		},
		following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
		followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
		biography: {
			type: String,
			default: "",
			max: 50,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
