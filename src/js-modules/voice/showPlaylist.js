const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getId());

			if (oConnection) {
				let sCurrentTitle = oConnection.getCurrentTitleName(),
					iOffset = 0,
					sAnswer = "```",
					aPlaylist = oConnection.getPlaylist();

				if (sCurrentTitle || aPlaylist.length > 0) {
					if (sCurrentTitle) {
						sAnswer += "1. " + sCurrentTitle;
						iOffset = 1;
					}

					if (aPlaylist.length > 0) {
						for (let i = 0; i < aPlaylist.length; i++) {
							sAnswer += `\n${i + iOffset + 1}. ${aPlaylist[i]}`;
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
