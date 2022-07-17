const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
	console.log(req.body);
	const newPost = new Post(req.body);
	try {
		newPost.postedBy = req.profile;
		const savedPost = await newPost.save();

		res.status(200).json(savedPost);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.getPost = async (req, res) => {
	Post.findById(req.params.postId)
		.populate("comments.postedBy", "_id username email")
		.populate("postedBy", "_id username email")
		.exec((err, result) => {
			if (err) return res.status(403).json("Post does not exist!");

			res.status(200).json(result);
		});
};

exports.feed = async (req, res) => {
	// get posts from user's following

	try {
		const following = await User.find({ _id: { $in: req.profile.following } });
		const user = await User.findById(req.profile.id);

		following.push(user); // add current user to array

		const posts = await Post.find({ postedBy: { $in: following } })
			.sort({ created: "descending" })
			.populate("postedBy", "_id username");

		res.status(200).json(posts);
	} catch {}
};

//like post
exports.likePost = async (req, res) => {
	const post = await Post.findById(req.params.postId);

	if (!post.likes.includes(req.body.userId)) {
		await post.updateOne({ $push: { likes: req.body.userId } }, { new: true });
		post.save();
		res.status(200).json(post);
	} else {
		res.status(403).json("You already liked this post");
	}
};

//unlike post
exports.unlikePost = async (req, res) => {
	const post = await Post.findById(req.params.postId);

	if (post.likes.includes(req.body.userId)) {
		await post.updateOne({ $pull: { likes: req.body.userId } }, { new: true });
		post.save();
		res.status(200).json(post);
	} else {
		res.status(403).json("You have not liked this post");
	}
};

//post comment on post
exports.comment = async (req, res) => {
	try {
		const post = await Post.findById(req.body.postId);
		if (post === null) return res.status(403).json("This post does not exist!");

		const user = await User.findById(req.body.userId);

		const newComment = {
			postedBy: user,
			text: req.body.text,
		};

		await post.updateOne({ $push: { comments: newComment } }, { new: true });

		post.save();

		res.status(200).json(post);
	} catch (error) {
		res.status(403).json(error);
	}
};
