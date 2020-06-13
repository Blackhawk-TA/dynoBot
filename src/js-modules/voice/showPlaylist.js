const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");
const MAX_MESSAGE_LENGTH = 2000;

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId());

			if (oConnection) {
				let sCurrentTitle = oConnection.getCurrentTitleName(),
					iOffset = 0,
					sShuffleMode = oConnection.getShuffleMode() ? "Enabled" : "Disabled",
					sAnswer = "Shuffle mode: " + sShuffleMode + "```",
					aPlaylist = oConnection.getPlaylist(),
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
								msg.getTextChannel().send(sAnswer);
								sAnswer = "```" + sAnswerLine;
							}
						}
					}
					sAnswer += "```";
				} else {
					sAnswer = "The playlist is empty.";
				}
				msg.getTextChannel().send(sAnswer);
			} else {
				msg.getTextChannel().send("You can only show the playlist when we are in the same voice channel.");
			}
		} else {
			msg.getTextChannel().send("You can only show the playlist when we are in the same voice channel.");
		}
	}
};
