const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId());

			oConnection.getApiConnection().resume();
			msg.getTextChannel().send("Ok, I will resume.");
		} else {
			msg.getTextChannel().send("You can only resume when you're in the same voice channel.");
		}
	}
};
