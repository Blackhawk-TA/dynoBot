const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId()),
				aPlaylist = oConnection.getPlaylist();

			if (aPlaylist.length > 0) {
				msg.getTextChannel().send(`Title skipped. Playing '${aPlaylist[0]}'.`);
				oConnection.play();
			} else {
				msg.getTextChannel().send("You cannot skip the last song in the playlist.");
			}
		} else {
			msg.getTextChannel().send("You can only skip a title when we are in the same voice channel.");
		}
	}
};
