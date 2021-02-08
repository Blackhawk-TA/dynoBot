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
				let sCurrentTitleName = oVoiceConnection.getCurrentTitleName(),
					sCurrentTitleUrl = oVoiceConnection.getCurrentTitleUrl();

				if (sCurrentTitleName && sCurrentTitleUrl) {
					oTextChannel.send(`Currently playing: '${sCurrentTitleName}'\nSource: ${sCurrentTitleUrl}`);
				} else {
					oTextChannel.send("I'm not playing music at the moment.");
				}
			} else {
				oTextChannel.send(commonMessages.Access.WrongVoiceChannel);
			}
		} else {
			oTextChannel.send(commonMessages.Access.NoVoiceChannel);
		}
	}
};
