const Message = require("../models/message");

exports.createNewMessage = async (req, res) => {
	const message = new Message(req.body);

	try {
		message.populate("sentBy", "username profilePicture _id");
		const newMessage = await message.save();
		res.status(200).send(newMessage);
	} catch (error) {
		res.status(500).json({ message: "Error creating message" });
	}
};

exports.getMessages = async (req, res) => {
	try {
		const messages = await Message.find({
			conversationId: req.params.conversationId,
		}).populate("sentBy", "username profilePicture _id");
		res.status(200).send(messages);
	} catch (error) {
		res.status(500).json({ message: "Error getting messages" });
	}
};
