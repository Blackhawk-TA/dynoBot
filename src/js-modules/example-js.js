module.exports = {
	run: function(msg) {
		msg.getTextChannel().send("I received these parameters: " + msg.getContentArray(true));
	},
	hook: function(channel) {
		channel.send("This js message is automatically sent in a specific interval");
	}
};
