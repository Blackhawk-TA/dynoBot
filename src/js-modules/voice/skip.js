const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel(),
			oTextChannel = msg.getTextChannel();

		if (oVoiceChannel) {
			let oVoiceConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId());

			if (oVoiceConnection && oVoiceChannel.getId() === oVoiceConnection.getChannelId()) {
				if (oVoiceConnection.getPlaylist().length > 0 || oVoiceConnection.getAutoplay()) {
					oVoiceConnection.play();
					oTextChannel.send(`Title skipped. Playing '${oVoiceConnection.getCurrentTitleName()}'.`);
				} else {
					oTextChannel.send("You cannot skip the last song in the playlist.");
				}
			} else {
				oTextChannel.send("You can only skip a title when we are in the same voice channel.");
			}
		} else {
			oTextChannel.send("You can only skip a title when we are in the same voice channel.");
		}
	}
};
