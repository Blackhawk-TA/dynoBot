const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (!oVoiceChannel) {
			msg.getTextChannel().send("You cannot order me to leave a channel in which you are not in.");
		} else if (!connectionsHandler.getConnection(oVoiceChannel.getId())) {
			msg.getTextChannel().send("I've already left this channel.");
		} else {
			connectionsHandler.unregisterConnection(oVoiceChannel.getId());
			msg.getTextChannel().send("Ok, I've left the channel.");
		}
	}
};
