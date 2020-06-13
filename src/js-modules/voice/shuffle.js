const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg, client, aRegexGroups) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId()),
				bShuffleMode = aRegexGroups[2] === "on";

			oConnection.setShuffleMode(bShuffleMode);
			msg.getTextChannel().send(`The shuffle mode was set to '${aRegexGroups[2]}'.`);
		} else {
			msg.getTextChannel().send("You have to be in the same voice channel to toggle shuffle mode.");
		}
	}
};
