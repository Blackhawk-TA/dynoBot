const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg, client, regexGroups) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getId()),
				sUrl = regexGroups[2],
				sResponse = "";

			switch (regexGroups[1]) {
				case "current": //Plays the requested title immediately
					oConnection.addNextTitle(sUrl);
					oConnection.play();
					sResponse = "Ok, I will play this title now.";
					break;
				case "next":
					oConnection.addNextTitle(sUrl);
					sResponse = "Ok, this will be the next title.";
					break;
				case "last":
					oConnection.addTitle(sUrl);
					sResponse = "Ok, the title was added to the end of the playlist";
					break;
				default:
					break;
			}

			msg.getTextChannel().send(sResponse);

		} else {
			msg.getTextChannel().send("You can only edit the playlist when we are in the same voice channel.");
		}
	}
};
