const base = require("path").resolve(".");
const joinHelper = require(base + "/src/js-modules/voice/utils/joinHelper");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");
const VoiceConnection = require(base + "/src/js-modules/voice/utils/VoiceConnection");
const logger = require(base + "/src/utils/logger");

module.exports = {
	run: function(msg, client, regexGroups) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel(),
			oTextChannel = msg.getTextChannel();

		if (oVoiceChannel) {
			let sServerId = oVoiceChannel.getServer().getId(),
				oVoiceConnection = connectionsHandler.getConnection(sServerId);

			if (oVoiceConnection && oVoiceChannel.getId() === oVoiceConnection.getChannelId()) {
				this._searchAndAddTitle(regexGroups, oTextChannel, oVoiceConnection);
			} else if (!oVoiceConnection) {
				oVoiceChannel.join().then(connection => {
					oVoiceConnection = new VoiceConnection(connection, client);

					joinHelper.playJoinMessage(oVoiceConnection, sServerId);
					this._searchAndAddTitle(regexGroups, oTextChannel, oVoiceConnection);
				}).catch(err => {
					logger.error("Could not add title: ", err);
					oTextChannel.send("Sorry, I could not join you.");
				});
			} else {
				oTextChannel.send("You can only edit the playlist when we are in the same voice channel.");
			}
		} else {
			oTextChannel.send("You can only edit the playlist when we are in the same voice channel.");
		}
	},

	_searchAndAddTitle: function(regexGroups, oChannel, oVoiceConnection) {
		let sAddType = regexGroups[1],
			sQuery = regexGroups[2],
			bIsSearch = !regexGroups[3];

		if (bIsSearch) {
			oVoiceConnection.searchTitle(sQuery).then(oResult => {
				this._handleAddTitle(oChannel, oVoiceConnection, sAddType, oResult);
			}).catch(err => {
				logger.warn("Could not find title: ", err);
				oChannel.send("I could not find this title.");
			});
		} else {
			let oTitle = {
				name: "",
				url: sQuery
			};
			this._handleAddTitle(oChannel, oVoiceConnection, sAddType, oTitle);
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
						logger.warn("Could not add current title: ", err);
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
						logger.warn("Could not add next title: ", err);
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
						logger.warn("Could not add title: ", err);
						channel.send("I cannot play this title.");
					});
				}
				break;
		}
	}
};
