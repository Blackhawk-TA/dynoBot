const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			let oConnection = connectionsHandler.getConnection(oVoiceChannel.getId());
			oConnection.play();
			msg.getTextChannel().send("Title skipped.");
		} else {
			msg.getTextChannel().send("You can only skip a title when we are in the same voice channel.");
		}
	}
};
