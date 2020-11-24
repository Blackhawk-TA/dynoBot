const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel(),
			oTextChannel = msg.getTextChannel();

		if (oVoiceChannel) {
			let oVoiceConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId());

			if (oVoiceConnection && oVoiceChannel.getId() === oVoiceConnection.getChannelId()) {
				oVoiceConnection.getApiConnection().resume();
				oTextChannel.send("Ok, I will resume.");
			} else {
				oTextChannel.send("You can only resume when you're in the same voice channel.");
			}
		} else {
			oTextChannel.send("You can only resume when you're in the same voice channel.");
		}
	}
};
