const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg, client, regexGroup) {
		let sPlaylistId = regexGroup[1],
			oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getId());

			if (oConnection) {
				oConnection.addPlaylist(sPlaylistId).then(() => {
					msg.getTextChannel().send("The YouTube playlist was added to the current playlist.");
				}).catch(err => {
					msg.getTextChannel().send("Could not add the playlist.");
					console.error(`${new Date().toLocaleString()}: ${err}`);
				});
			} else {
				msg.getTextChannel().send("You can only edit the playlist when we are in the same voice channel.");
			}
		} else {
			msg.getTextChannel().send("You can only edit the playlist when we are in the same voice channel.");
		}
	}
};
