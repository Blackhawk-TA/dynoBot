const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			connectionsHandler.unregisterConnection(oVoiceChannel.getId());
			msg.getTextChannel().send("Ok, I've left the channel.");
		} else {
			msg.getTextChannel().send("You cannot order me to leave a channel in which you are not in.");
		}
	}
};
