const base = require("path").resolve(".");
const joinHelper = require(base + "/src/js-modules/voice/utils/joinHelper");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");
const VoiceConnection = require(base + "/src/js-modules/voice/utils/VoiceConnection");

module.exports = {
	run: function(msg, client, regexGroups) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel(),
			oChannel = msg.getTextChannel();

		if (oVoiceChannel) {
			let sServerId = oVoiceChannel.getServer().getId(),
				oVoiceConnection = connectionsHandler.getConnection(sServerId);

			if (oVoiceConnection && oVoiceChannel.getId() === oVoiceConnection.getChannelId()) {
				this._addPlaylist(regexGroups, msg.getTextChannel(), oVoiceConnection);
			} else if (!oVoiceConnection) {
				oVoiceChannel.join().then(connection => {
					oVoiceConnection = new VoiceConnection(connection, client);

					joinHelper.playJoinMessage(oVoiceConnection, sServerId);
					this._addPlaylist(regexGroups, oChannel, oVoiceConnection);
				}).catch(err => {
					console.error(`${new Date().toLocaleString()}: addPlaylist.js: ${err}`);
					oChannel.send("Sorry, I could not join you.");
				});
			} else {
				oChannel.send("You can only edit the playlist when we are in the same voice channel.");
			}
		} else {
			oChannel.send("You can only edit the playlist when we are in the same voice channel.");
		}
	},

	_addPlaylist: function(regexGroups, oChannel, oVoiceConnection) {
		let sPlaylistUrl = regexGroups[1] || regexGroups[3],
			sPlaylistType = regexGroups[2] || regexGroups[4],
			sPlaylistId = regexGroups[6];

		switch (sPlaylistType) {
			case "apple":
				oVoiceConnection.addAppleMusicPlaylist(sPlaylistUrl).then(aFailedTitles => {
					let sAnswer = "The Apple Music playlist was added to the current playlist." + this._generateFailedTitlesWarning(aFailedTitles);
					oChannel.send(sAnswer);
				}).catch(err => {
					oChannel.send("Could not add the playlist.");
					console.error(`${new Date().toLocaleString()}: ${err}`);
				});
				break;
			case "spotify":
				oVoiceConnection.addSpotifyPlaylist(sPlaylistUrl).then(aFailedTitles => {
					let sAnswer = "The Spotify playlist was added to the current playlist." + this._generateFailedTitlesWarning(aFailedTitles);
					oChannel.send(sAnswer);
				}).catch(err => {
					oChannel.send("Could not add the playlist.");
					console.error(`${new Date().toLocaleString()}: ${err}`);
				});
				break;
			default:
				oVoiceConnection.addPlaylist(sPlaylistId).then(() => {
					oChannel.send("The YouTube playlist was added to the current playlist.");
				}).catch(err => {
					oChannel.send("Could not add the playlist.");
					console.error(`${new Date().toLocaleString()}: ${err}`);
				});
				break;
		}
	},

	_generateFailedTitlesWarning: function(aFailedTitles) {
		let sWarningText = "";

		if (aFailedTitles.length === 1) {
			sWarningText =`\n${aFailedTitles.length} title could not be added.`;
		} else if (aFailedTitles.length > 1) {
			sWarningText = `\n${aFailedTitles.length} titles could not be added.`;
		}

		return sWarningText;
	}
};
