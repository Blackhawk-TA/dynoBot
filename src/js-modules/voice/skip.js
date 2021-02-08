const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");
const commonMessages = require(base + "/src/js-modules/voice/utils/commonMessages");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel(),
			oTextChannel = msg.getTextChannel();

		if (oVoiceChannel) {
			let oVoiceConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId());

			if (oVoiceConnection && oVoiceChannel.getId() === oVoiceConnection.getChannelId()) {
				if (oVoiceConnection.getPlaylist().length > 0) {
					oVoiceConnection.play();
					oTextChannel.send(`Title skipped. Playing '${oVoiceConnection.getCurrentTitleName()}'.`);
				} else {
					oTextChannel.send("You cannot skip the last song in the playlist.");
				}
			} else {
				oTextChannel.send(commonMessages.Access.WrongVoiceChannel);
			}
		} else {
			oTextChannel.send(commonMessages.Access.NoVoiceChannel);
		}
	}
};
