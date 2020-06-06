const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId());

			if (oConnection) {
				let sCurrentTitleName = oConnection.getCurrentTitleName(),
					sCurrentTitleUrl = oConnection.getCurrentTitleUrl();

				if (sCurrentTitleName && sCurrentTitleUrl) {
					msg.getTextChannel().send(`Currently playing: '${sCurrentTitleName}'\nSource: ${sCurrentTitleUrl}`);
				} else {
					msg.getTextChannel().send("I'm not playing music at the moment.");
				}
			} else {
				msg.getTextChannel().send("You can only get the current song when we are in the same voice channel.");
			}
		} else {
			msg.getTextChannel().send("You cannot order me to leave a channel in which you are not in.");
		}
	}
};
