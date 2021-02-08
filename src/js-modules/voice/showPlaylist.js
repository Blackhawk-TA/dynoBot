const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");
const commonMessages = require(base + "/src/js-modules/voice/utils/commonMessages");
const MAX_MESSAGE_LENGTH = 2000;

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel(),
			oTextChannel = msg.getTextChannel();

		if (oVoiceChannel) {
			let oVoiceConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId());

			if (oVoiceConnection && oVoiceChannel.getId() === oVoiceConnection.getChannelId()) {
				let sCurrentTitle = oVoiceConnection.getCurrentTitleName(),
					iOffset = 0,
					sShuffleMode = oVoiceConnection.getShuffleMode() ? "Enabled" : "Disabled",
					sAutoplay = oVoiceConnection.getAutoplay() ? "Enabled" : "Disabled",
					sAnswer = "Autoplay: " + sAutoplay + "\nShuffle mode: " + sShuffleMode + "```",
					aPlaylist = oVoiceConnection.getPlaylist(),
					sAnswerLine;

				if (sCurrentTitle || aPlaylist.length > 0) {
					if (sCurrentTitle) {
						sAnswer += "1. " + sCurrentTitle;
						iOffset = 1;
					}

					if (aPlaylist.length > 0) {
						for (let i = 0; i < aPlaylist.length; i++) {
							sAnswerLine = `\n${i + iOffset + 1}. ${aPlaylist[i]}`;

							if (sAnswer.length + sAnswerLine.length < MAX_MESSAGE_LENGTH) {
								sAnswer += sAnswerLine;
							} else {
								sAnswer += "```";
								oTextChannel.send(sAnswer);
								sAnswer = "```" + sAnswerLine;
							}
						}
					}
					sAnswer += "```";
				} else {
					sAnswer = "The playlist is empty.";
				}
				oTextChannel.send(sAnswer);
			} else {
				oTextChannel.send(commonMessages.Access.WrongVoiceChannel);
			}
		} else {
			oTextChannel.send(commonMessages.Access.NoVoiceChannel);
		}
	}
};
