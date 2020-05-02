const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.unregisterConnection(oVoiceChannel.getId());

			oConnection.getApiConnection().removeAllListeners("end");
			oConnection.getApiConnection().disconnect();
			msg.getTextChannel().send("Ok, I will leave the channel.");
		} else {
			msg.getTextChannel().send("You cannot order me to leave a channel in which you are not in.");
		}
	}
};
