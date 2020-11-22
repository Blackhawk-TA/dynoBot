const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg, client, aRegexGroups) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel(),
			oTextChannel = msg.getTextChannel();

		if (oVoiceChannel) {
			let oVoiceConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId()),
				bAutoplay = aRegexGroups[1] === "on";

			if (oVoiceConnection && oVoiceChannel.getId() === oVoiceConnection.getChannelId()) {
				oVoiceConnection.setAutoplay(bAutoplay);
				oTextChannel.send(`Autoplay was set to '${aRegexGroups[1]}'.`);
			} else {
				oTextChannel.send("You can only set autoplay when we are in the same voice channel.");
			}
		} else {
			oTextChannel.send("You have to be in the same voice channel to toggle autoplay.");
		}
	}
};
