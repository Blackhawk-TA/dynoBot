const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");
const VoiceConnection = require(base + "/src/js-modules/voice/utils/VoiceConnection");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (!oVoiceChannel) {
			msg.getTextChannel().send("I can only join you, if you're in a voice channel.");
		} else if (connectionsHandler.getConnection(oVoiceChannel.getId())) {
			msg.getTextChannel().send("There is already an active voice connection in this channel.");
		} else {
			oVoiceChannel.join().then(connection => {
				let oVoiceConnection = new VoiceConnection(connection),
					aPlaylist = oVoiceConnection.getPlaylist(),
					oVoiceConfig = configHandler.readJSON(base + "/cfg/config.json", msg.getServer().getId()),
					bJoinMessageEnabled = oVoiceConfig.voice_join_message.enabled,
					sJoinMessagePath = oVoiceConfig.voice_join_message.path;

				connectionsHandler.registerConnection(oVoiceConnection);

				if (bJoinMessageEnabled) {
					oVoiceConnection.getApiConnection().play(sJoinMessagePath);
				}

				if (aPlaylist.length > 0) {
					oVoiceConnection.play();
					msg.getTextChannel().send("Ok, I've joined you and I'll play your playlist.");
				} else {
					msg.getTextChannel().send("I've joined you, but the playlist is empty so I can't play anything.");
				}
			}).catch(error => {
				console.error(`${new Date().toLocaleString()}: ${error}`);
				msg.getTextChannel().send("Sorry, I could not join you.");
			});
		}
	}
};
