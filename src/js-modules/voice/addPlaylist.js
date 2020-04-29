const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg, client, regexGroup) {
		let sPlaylistId = regexGroup[1],
			oVoiceChannel = msg.getAuthor().getVoiceChannel(),
			sResponse;

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getId());

			if (oConnection) {
				oConnection.addPlaylist(sPlaylistId);
				sResponse = "The YouTube playlist was added to the current playlist.";
			} else {
				sResponse = "You can only edit the playlist when we are in the same voice channel.";
			}
		} else {
			sResponse = "You can only edit the playlist when we are in the same voice channel.";
		}
		msg.getTextChannel().send(sResponse);
	}
};
