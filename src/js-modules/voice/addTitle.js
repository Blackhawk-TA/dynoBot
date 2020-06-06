const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg, client, regexGroups) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId()),
				sAddType = regexGroups[1],
				sQuery = regexGroups[2],
				bIsSearch = !regexGroups[3],
				oChannel = msg.getTextChannel();

			if (oConnection) {
				if (bIsSearch) {
					oConnection.searchTitle(sQuery).then(oResult => {
						this._handleAddTitle(oChannel, oConnection, sAddType, oResult);
					}).catch(err => {
						console.error(`${new Date().toLocaleString()}: ${err}`);
						msg.getTextChannel().send("I could not find this title.");
					});
				} else {
					let oTitle = {
						name: "",
						url: sQuery
					};
					this._handleAddTitle(oChannel, oConnection, sAddType, oTitle);
				}
			} else {
				msg.getTextChannel().send("You can only edit the playlist when we are in the same voice channel.");
			}
		} else {
			msg.getTextChannel().send("You can only edit the playlist when we are in the same voice channel.");
		}
	},

	_handleAddTitle: function(channel, oConnection, sAddType, oTitle) {
		switch (sAddType) {
			case "current":
				if (oTitle.name) {
					oConnection.addCurrentTitle(oTitle);
					channel.send(`Ok, playing '${oTitle.name}'`);
				} else {
					oConnection.getTitle(oTitle.url).then(oResult => {
						oConnection.addCurrentTitle(oResult);
						channel.send(`Ok, playing '${oResult.name}'`);
					}).catch(err => {
						console.error(`${new Date().toLocaleString()}: ${err}`);
						channel.send("I cannot play this title.");
					});
				}
				break;
			case "next":
				if (oTitle.name) {
					oConnection.addNextTitle(oTitle);
					channel.send(`The next title will be '${oTitle.name}'`);
				} else {
					oConnection.getTitle(oTitle.url).then(oResult => {
						oConnection.addNextTitle(oResult);
						channel.send(`The next title will be '${oResult.name}'`);
					}).catch(err => {
						console.error(`${new Date().toLocaleString()}: ${err}`);
						channel.send("I cannot play this title.");
					});
				}
				break;
			default:
				if (oTitle.name) {
					oConnection.addTitle(oTitle);
					channel.send(`Added '${oTitle.name}' to the playlist.`);
				} else {
					oConnection.getTitle(oTitle.url).then(oResult => {
						oConnection.addTitle(oResult);
						channel.send(`Added '${oResult.name}' to the playlist.`);
					}).catch(err => {
						console.error(`${new Date().toLocaleString()}: ${err}`);
						channel.send("I cannot play this title.");
					});
				}
				break;
		}
	}
};
