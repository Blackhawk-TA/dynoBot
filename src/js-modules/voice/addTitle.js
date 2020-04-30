const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg, client, regexGroups) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getId()),
				sAddType = regexGroups[1],
				sQuery = regexGroups[2],
				bIsSearch = !regexGroups[3],
				oChannel = msg.getTextChannel();

			if (oConnection) {
				if (bIsSearch) {
					oConnection.searchTitle(sQuery).then(oResult => {
						this._handleAddTitle(oChannel, oConnection, sAddType, oResult.url);
					}).catch(err => {
						console.error(`${new Date().toLocaleString()}: ${err}`);
						msg.getTextChannel().send("I could not find this title.");
					});
				} else {
					this._handleAddTitle(oChannel, oConnection, sAddType, sQuery);
				}
			} else {
				msg.getTextChannel().send("You can only edit the playlist when we are in the same voice channel.");
			}
		} else {
			msg.getTextChannel().send("You can only edit the playlist when we are in the same voice channel.");
		}
	},

	_handleAddTitle: function(channel, oConnection, sAddType, sUrl) {
		switch (sAddType) {
			case "current":
				oConnection.addCurrentTitle(sUrl).then(oResult => {
					channel.send(`Ok, playing '${oResult.name}'`);
				}).catch(err => {
					console.error(`${new Date().toLocaleString()}: ${err}`);
					channel.send("I could not play this title.");
				});
				break;
			case "next":
				oConnection.addNextTitle(sUrl).then(oResult => {
					channel.send(`The next title will be '${oResult.name}'`);
				}).catch(err => {
					console.error(`${new Date().toLocaleString()}: ${err}`);
					channel.send("I could not play this title.");
				});
				break;
			default:
				oConnection.addTitle(sUrl).then(oResult => {
					channel.send(`Added '${oResult.name}' to the playlist.`);
				}).catch(err => {
					console.error(`${new Date().toLocaleString()}: ${err}`);
					channel.send("I could not play this title.");
				});
				break;
		}
	}
};
