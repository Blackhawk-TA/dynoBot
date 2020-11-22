const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");

module.exports = {
	run: function(msg, client) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel(),
			oTextChannel = msg.getTextChannel();

		if (oVoiceChannel) {
			let oVoiceConnection = connectionsHandler.getConnection(oVoiceChannel.getServer().getId());

			if (oVoiceConnection && oVoiceChannel.getId() === oVoiceConnection.getChannelId()) {
				connectionsHandler.unregisterConnection(oVoiceChannel.getServer().getId());
				client.setPresence("");
				oTextChannel.send("Ok, I've left the channel.");
			} else if (!oVoiceConnection) {
				oTextChannel.send("I've already left this channel.");
			} else {
				oTextChannel.send("You cannot order me to leave a channel in which you are not in.");
			}
		} else {
			oTextChannel.send("You cannot order me to leave a channel in which you are not in.");
		}
	}
};
