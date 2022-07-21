const Conversation = require("../models/Conversation");

exports.createConversation = async (req, res) => {
	const conversation = new Conversation({
		members: [req.body.senderId, req.body.receiverId],
	});

	console.log(conversation);

	try {
		const newConversation = await conversation.save();

		res.status(200).send(newConversation);
	} catch (error) {
		res.status(500).json({ message: "Error creating conversation" });
	}
};

exports.getConversations = async (req, res) => {
	try {
		const conversations = await Conversation.find({
			members: { $in: [req.params.userId] },
		}).populate("members", "username profilePicture _id");
		res.status(200).send(conversations);
	} catch (error) {
		res.status(500).json({ message: "Error getting conversations" });
	}
};
