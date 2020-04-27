const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let voiceChannel = msg.getAuthor().getVoiceChannel();

		if (voiceChannel) {
			let connection = connectionsHandler.getConnection(voiceChannel.getId());

			connection.getApiConnection().resume();
			msg.getTextChannel().send("Ok, I will resume.");
		} else {
			msg.getTextChannel().send("You can only resume when you're in the same voice channel.");
		}
	}
};
