const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getId()),
				aPlaylist = [],
				sCurrentTitle = "",
				sAnswer = "";

			if (oConnection) {
				sCurrentTitle = oConnection.getCurrentTitleName();
				if (sCurrentTitle) {
					aPlaylist = oConnection.getPlaylist();
					sAnswer = "```";
					sAnswer += "1. " + sCurrentTitle;
					for (let i = 0; i < aPlaylist.length; i++) {
						sAnswer += `\n${i + 2}. ${aPlaylist[i]}`;
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
