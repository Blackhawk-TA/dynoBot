const base = require("path").resolve(".");
const joinHelper = require(base + "/src/js-modules/voice/utils/joinHelper");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");
const commonMessages = require(base + "/src/js-modules/voice/utils/commonMessages");
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
				this._addPlaylist(regexGroups, msg.getTextChannel(), oVoiceConnection);
			} else if (!oVoiceConnection) {
				oVoiceChannel.join().then(connection => {
					oVoiceConnection = new VoiceConnection(connection, client);

					joinHelper.playJoinMessage(oVoiceConnection, sServerId);
					this._addPlaylist(regexGroups, oTextChannel, oVoiceConnection);
				}).catch(err => {
					logger.error("Could not add playlist: ", err);
					oTextChannel.send("Sorry, I could not join you.");
				});
			} else {
				oTextChannel.send(commonMessages.Access.WrongVoiceChannel);
			}
		} else {
			oTextChannel.send(commonMessages.Access.NoVoiceChannel);
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
					logger.warn("Could not add Apple Music playlist: ", err);
				});
				break;
			case "spotify":
				oVoiceConnection.addSpotifyPlaylist(sPlaylistUrl).then(aFailedTitles => {
					let sAnswer = "The Spotify playlist was added to the current playlist." + this._generateFailedTitlesWarning(aFailedTitles);
					oChannel.send(sAnswer);
				}).catch(err => {
					oChannel.send("Could not add the playlist.");
					logger.warn("Could not add Spotify playlist: ", err);
				});
				break;
			default:
				oVoiceConnection.addPlaylist(sPlaylistId).then(() => {
					oChannel.send("The YouTube playlist was added to the current playlist.");
				}).catch(err => {
					oChannel.send("Could not add the playlist.");
					logger.warn("Could not add YouTube playlist: ", err);
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
