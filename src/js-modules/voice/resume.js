module.exports = {
	run: function(msg) {
		let voiceChannel = msg.getAuthor().getVoiceChannel(),
			connection = voiceChannel && voiceChannel.getConnection();

		if (connection) {
			connection.resume();
			msg.getTextChannel().send("Ok, I will resume.");
		} else {
			msg.getTextChannel().send("You can only resume when you're in the same voice channel.");
		}
	}
};
