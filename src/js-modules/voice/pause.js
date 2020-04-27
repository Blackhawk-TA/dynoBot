module.exports = {
	run: function(msg) {
		let voiceChannel = msg.getAuthor().getVoiceChannel(),
			connection = voiceChannel && voiceChannel.getConnection();

		if (connection) {
			connection.pause();
			msg.getTextChannel().send("Ok, I will pause. Enter resume to continue listening.");
		} else {
			msg.getTextChannel().send("You can only pause me when you're in the same voice channel.");
		}
	}
};
