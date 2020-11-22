const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg, client, aRegexGroups) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId()),
				bAutoplay = aRegexGroups[1] === "on";

			if (oConnection) {
				oConnection.setAutoplay(bAutoplay);
				msg.getTextChannel().send(`Autoplay was set to '${aRegexGroups[1]}'.`);
			} else {
				msg.getTextChannel().send("You can only set autoplay when we are in the same voice channel.");
			}
		} else {
			msg.getTextChannel().send("You have to be in the same voice channel to toggle autoplay.");
		}
	}
};
