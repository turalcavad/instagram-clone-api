const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { expressjwt } = require("express-jwt");

//REGISTER
exports.register = async (req, res) => {
	try {
		const userExists = await User.findOne({ email: req.body.email });

		if (userExists) {
			return res.status(403).json({
				error: "Email is taken!",
			});
		}

		//generate hashed password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		//create new user
		const newUser = await new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});

		//save user
		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
};

//LOGIN
exports.login = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			res.status(400).json({ message: "User not found" });
		}
		const isMatch = await bcrypt.compare(req.body.password, user.password);
		if (!isMatch) {
			res.status(400).json({ message: "Incorrect password" });
		}

		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

		res.cookie("t", token, { expire: new Date() + 9999 });

		const { _id, username, email } = user;

		return res.json({ token, user: { _id, email, username } });
	} catch (err) {
		1;
		console.log(err);
	}
};

exports.signout = (req, res) => {
	res.clearCookie("t");

	res.json({ message: "Signout successful" });
};

exports.requireSignin = expressjwt({
	secret: process.env.JWT_SECRET,
	algorithms: ["HS256"],
});
