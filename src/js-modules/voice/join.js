const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");
const VoiceConnection = require(base + "/src/js-modules/voice/utils/VoiceConnection");

module.exports = {
	run: function(msg) {
		let oVoiceChannel = msg.getAuthor().getVoiceChannel();

		if (oVoiceChannel) {
			oVoiceChannel.join().then(connection => {
				let oVoiceConnection = new VoiceConnection(connection),
					aPlaylist = oVoiceConnection.getPlaylist();

				connectionsHandler.registerConnection(oVoiceConnection);

				if (aPlaylist.length > 0) {
					oVoiceConnection.play();

					//Plays the next title when the previous one ended
					oVoiceConnection.getApiConnection().onEvent("end", () => {
						oVoiceConnection.play();
					});

					msg.getTextChannel().send("Ok, I've joined you and I'll play your playlist.");
				} else {
					msg.getTextChannel().send("I've joined you, but the playlist is empty so I can't play anything.");
				}
			}).catch(error => {
				console.error(`${new Date().toLocaleString()}: ${error}`);
				msg.getTextChannel().send("Sorry, I could not join you.");
			});
		} else {
			msg.getTextChannel().send("I can only join you, if you're in a voice channel.");
		}
	}
};
