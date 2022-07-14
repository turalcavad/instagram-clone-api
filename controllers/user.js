const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.userById = async (req, res, next, id) => {
	console.log("UserByID");
	User.findById(id)
		.populate("following", "_id name")
		.populate("followers", "_id name")

		.exec((err, user) => {
			if (err || !user) {
				return res.status(400).json({
					error: "User not found",
				});
			}
			req.profile = user;
			next();
		});
};

//get user
exports.getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		//exclude unnecessary properties
		const { password, updatedAt, ...other } = user._doc;

		return res.status(200).json(other);
	} catch (error) {
		return res.status(404).json("User not found");
	}
};

exports.updateUser = async (req, res) => {
	if (req.body.userId == req.params.id) {
		//update password
		if (req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (err) {
				return res.status(500).json(err);
			}
		}

		try {
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			});

			res.status(200).json("Account has been updated");
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json("You can only update your own account!");
	}
};

exports.deleteUser = async (req, res) => {
	if (req.body.userId == req.params.id) {
		try {
			await User.findByIdAndDelete({ _id: req.params.id });

			res.status(200).json("Account has been deleted");
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json("You can only delete your own account!");
	}
};

exports.followUser = async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id); // user being followed
			const currentUser = await User.findById(req.body.userId); // user who wants to follow

			//check if current user already follows currentUser or not
			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({ $push: { followers: req.body.userId } });
				await currentUser.updateOne({ $push: { following: req.params.id } });

				res.status(200).json("User has been followed");
			} else {
				res.status(403).json("You already follow this user!");
			}
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json("You cannot follow yourself!");
	}
};

exports.unfollowUser = async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id); // user being unfollowed
			const currentUser = await User.findById(req.body.userId); // user who wants to unfollow

			if (user.followers.includes(req.body.userId)) {
				await user.updateOne({ $push: { followers: req.body.userId } });
				await currentUser.updateOne({ $push: { following: req.params.id } });

				res.status(200).json("User has been followed");
			} else {
				res.status(403).json("You do not follow this user");
			}
		} catch (error) {}
	} else {
		res.status(403).json("You cannot unfollow yourself!");
	}
};
