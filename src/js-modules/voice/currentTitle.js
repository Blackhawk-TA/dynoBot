const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel(),
			oTextChannel = msg.getTextChannel();

		if (oVoiceChannel) {
			let oVoiceConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId());

			if (oVoiceConnection && oVoiceChannel.getId() === oVoiceConnection.getChannelId()) {
				let sCurrentTitleName = oVoiceConnection.getCurrentTitleName(),
					sCurrentTitleUrl = oVoiceConnection.getCurrentTitleUrl();

				if (sCurrentTitleName && sCurrentTitleUrl) {
					oTextChannel.send(`Currently playing: '${sCurrentTitleName}'\nSource: ${sCurrentTitleUrl}`);
				} else {
					oTextChannel.send("I'm not playing music at the moment.");
				}
			} else {
				oTextChannel.send("You can only get the current song when we are in the same voice channel.");
			}
		} else {
			oTextChannel.send("You cannot order me to leave a channel in which you are not in.");
		}
	}
};
