const base = require("path").resolve(".");
const connectionsHandler = require(base + "/src/js-modules/voice/utils/connectionsHandler");
const VoiceConnection = require(base + "/src/js-modules/voice/utils/VoiceConnection");
const ytDownload = require("ytdl-core");

module.exports = {
	run: function(msg) {
		let voiceChannel = msg.getAuthor().getVoiceChannel();

		if (voiceChannel) {
			voiceChannel.join().then(connection => {
				let voiceConnection = new VoiceConnection(connection),
					playlist = voiceConnection.getPlaylist();

				connectionsHandler.registerConnection(voiceConnection);

				if (playlist.length > 0) {
					voiceConnection.getApiConnection().play(ytDownload(playlist[0], { filter: "audioonly" }));
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
