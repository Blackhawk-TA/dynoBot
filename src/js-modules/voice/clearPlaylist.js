const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel(),
			oTextChannel = msg.getTextChannel();

		if (oVoiceChannel) {
			let oVoiceConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId());

			if (oVoiceConnection && oVoiceChannel.getId() === oVoiceConnection.getChannelId()) {
				oVoiceConnection.clearPlaylist();
				oTextChannel.send("The playlist was cleared.");
			} else {
				oTextChannel.send("You have to be in the same voice channel to access this command");
			}
		} else {
			oTextChannel.send("You have to be in the same voice channel to access this command");
		}
	}
};
