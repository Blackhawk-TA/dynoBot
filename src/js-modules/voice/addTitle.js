const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg, client, regexGroups) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getId()),
				sAddType = regexGroups[1],
				sQuery = regexGroups[2],
				sResponse = "",
				bIsSearch = !regexGroups[3];

			if (oConnection) {
				if (bIsSearch) {
					oConnection.searchTitle(sQuery).then(sUrl => {
						sResponse = this._handleAddTitle(oConnection, sAddType, sUrl);
						msg.getTextChannel().send(sResponse);
					}).catch(error => {
						console.error(`${new Date().toLocaleString()}: ${error}`);
						msg.getTextChannel().send("I could not find this title.");
					});
				} else {
					sResponse = this._handleAddTitle(oConnection, sAddType, sQuery);
					msg.getTextChannel().send(sResponse);
				}
			} else {
				msg.getTextChannel().send("You can only edit the playlist when we are in the same voice channel.");
			}
		} else {
			msg.getTextChannel().send("You can only edit the playlist when we are in the same voice channel.");
		}
	},

	_handleAddTitle: function(oConnection, sAddType, sUrl) {
		switch (sAddType) {
			case "current":
				oConnection.addCurrentTitle(sUrl);
				return "Ok, I will play this title now.";
			case "next":
				oConnection.addNextTitle(sUrl);
				return "Ok, this will be the next title.";
			default:
				oConnection.addTitle(sUrl);
				return "Ok, the title was added to the end of the playlist";
		}
	}
};
