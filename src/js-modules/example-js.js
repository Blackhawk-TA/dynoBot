module.exports = {
	run: function(msg) {
		msg.getChannel().send("I received these parameters: " + msg.getContentArray());
	},
	hook: function(channel) {
		channel.send("This js message is automatically sent in a specific interval");
	}
};