const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let voiceChannel = msg.getAuthor().getVoiceChannel();

		if (voiceChannel) {
			connectionsHandler.unregisterConnection(voiceChannel.getId());
			voiceChannel.leave();
			msg.getTextChannel().send("Ok, I will leave the channel.");
		} else {
			msg.getTextChannel().send("You cannot order me to leave a channel in which you are not in.");
		}
	}
};
