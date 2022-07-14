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

//edit user
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

//delete user
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

//follow
exports.followUser = async (req, res) => {
	if (req.body.userId !== req.params.id) {
		const user = await User.findById(req.params.id); // user being followed
		// //check if current user already follows currentUser or not
		// if (user.followers.includes({req.body.userId}))
		// 	return res.status(403).json("You already follow this user!");

		if (user.followers.includes(req.body.userId))
			return res.status(403).json("You already follow this user!");

		try {
			//update followings array
			User.findByIdAndUpdate(
				req.body.userId,
				{ $push: { following: req.params.id } },
				(err, result) => {
					if (err) {
						return res.status(400).json({ error: err });
					}
				}
			);

			//update followers array
			User.findByIdAndUpdate(
				req.params.id,
				{ $push: { followers: req.body.userId } },
				{ new: true }
			)
				.populate("following", "_id username fullName")
				.populate("followers", "_id username")
				.exec((err, result) => {
					if (err) {
						return res.status(400).json({
							error: err,
						});
					}
					res.json(result);
				});
		} catch (error) {}
	} else {
		res.status(403).json("You cannot follow yourself!");
	}
};

//unfollow
exports.unfollowUser = async (req, res) => {
	if (req.body.userId !== req.params.id) {
		const user = await User.findById(req.body.userId);
		//check if user already follows currentUser or not
		if (!user.following.includes(req.params.id))
			return res.status(403).json("You do not follow this user");

		//update followings array
		await user.updateOne({ $pull: { following: req.params.id } });

		//update followers array
		User.findByIdAndUpdate(req.params.id, {
			$pull: { followers: req.body.userId },
		})
			.populate("following", "_id username fullName")
			.populate("followers", "_id username")
			.exec((err, result) => {
				if (err) {
					return res.status(400).json({
						error: err,
					});
				}
				res.json(result);
			});
	} else {
		res.status(403).json("You cannot unfollow yourself!");
	}
};
