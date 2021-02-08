const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");
const commonMessages = require(base + "/src/js-modules/voice/utils/commonMessages");

module.exports = {
	run: function(msg, client, aRegexGroups) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel(),
			oTextChannel = msg.getTextChannel();

		if (oVoiceChannel) {
			let oVoiceConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId()),
				bAutoplay = aRegexGroups[1] === "on";

			if (oVoiceConnection && oVoiceChannel.getId() === oVoiceConnection.getChannelId()) {
				if (oVoiceConnection.getCurrentTitleUrl()) {
					oVoiceConnection.setAutoplay(bAutoplay);
					oTextChannel.send(`Autoplay was set to '${aRegexGroups[1]}'.`);
				} else {
					oTextChannel.send("At least one title in the playlist is required.");
				}
			} else {
				oTextChannel.send(commonMessages.Access.WrongVoiceChannel);
			}
		} else {
			oTextChannel.send(commonMessages.Access.NoVoiceChannel);
		}
	}
};
