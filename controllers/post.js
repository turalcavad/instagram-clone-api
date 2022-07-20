const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
	try {
		const newPost = new Post(req.body);
		newPost.postedBy = req.profile;
		const savedPost = await newPost.save();

		res.status(200).json(savedPost);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.getPost = async (req, res) => {
	try {
		Post.findById(req.params.postId)
			.populate("comments.postedBy", "_id username email")
			.populate("postedBy", "_id username email")
			.populate("likes.likedBy", "_id username")
			.exec((err, result) => {
				if (err) return res.status(403).json("Post does not exist!");
				res.status(200).json(result);
			});
	} catch (error) {
		res.status(403).json(error);
	}
};

exports.feed = async (req, res) => {
	// get posts from user's following

	try {
		const following = await User.find({ _id: { $in: req.profile.following } });
		const user = await User.findById(req.profile.id);

		following.push(user); // add current user to array

		const posts = await Post.find({ postedBy: { $in: following } })
			.sort({ created: "descending" })
			.populate("postedBy", "_id username")
			.populate("likes.likedBy", "_id username");

		res.status(200).json(posts);
	} catch {}
};

//like post
exports.likePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.postId);
		const user = await User.findById(req.body.userId); // user who liked the post

		const likedBy = {
			likedBy: user,
		};

		const alreadyLiked = post.likes.some((like) => {
			return like.likedBy._id.toString() === user._id.toString();
		});

		if (alreadyLiked)
			return res.status(403).json("You have already liked this post");

		await post.updateOne({ $push: { likes: likedBy } }, { new: true });
		post.save();
		res.status(200).json(post);
	} catch (error) {
		res.status(403).json(error);
	}
};

//unlike post
exports.unlikePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.postId);
		const user = await User.findById(req.body.userId);

		const likedBy = {
			likedBy: user,
		};

		const liked = post.likes.some((like) => {
			return like.likedBy._id.toString() === user._id.toString();
		});
		if (!liked) return res.status(403).json("You have not liked this post");

		await post.updateOne({ $pull: { likes: likedBy } }, { new: true });
		post.save();
		res.status(200).json(post);
	} catch (error) {
		res.status(403).json(error);
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
