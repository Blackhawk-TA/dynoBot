const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg, client, regexGroup) {
		let sPlaylistUrl = regexGroup[1] || regexGroup[3],
			sPlaylistType = regexGroup[2] || regexGroup[4],
			sPlaylistId = regexGroup[6],
			oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId());

			if (oConnection) {
				switch (sPlaylistType) {
					case "apple":
						oConnection.addAppleMusicPlaylist(sPlaylistUrl).then(aFailedTitles => {
							var sAnswer = "The Apple Music playlist was added to the current playlist." + this.generateFailedTitlesWarning(aFailedTitles);
							msg.getTextChannel().send(sAnswer);
						}).catch(err => {
							msg.getTextChannel().send("Could not add the playlist.");
							console.error(`${new Date().toLocaleString()}: ${err}`);
						});
						break;
					case "spotify":
						oConnection.addSpotifyPlaylist(sPlaylistUrl).then(aFailedTitles => {
							var sAnswer = "The Spotify playlist was added to the current playlist." + this.generateFailedTitlesWarning(aFailedTitles);
							msg.getTextChannel().send(sAnswer);
						}).catch(err => {
							msg.getTextChannel().send("Could not add the playlist.");
							console.error(`${new Date().toLocaleString()}: ${err}`);
						});
						break;
					default:
						oConnection.addPlaylist(sPlaylistId).then(() => {
							msg.getTextChannel().send("The YouTube playlist was added to the current playlist.");
						}).catch(err => {
							msg.getTextChannel().send("Could not add the playlist.");
							console.error(`${new Date().toLocaleString()}: ${err}`);
						});
						break;
				}
			} else {
				msg.getTextChannel().send("You can only edit the playlist when we are in the same voice channel.");
			}
		} else {
			msg.getTextChannel().send("You can only edit the playlist when we are in the same voice channel.");
		}
	},

	generateFailedTitlesWarning: function(aFailedTitles) {
		var sWarningText = "";

		if (aFailedTitles.length === 1) {
			sWarningText =`\n${aFailedTitles.length} title could not be added.`;
		} else if (aFailedTitles.length > 1) {
			sWarningText = `\n${aFailedTitles.length} titles could not be added.`;
		}

		return sWarningText;
	}
};
