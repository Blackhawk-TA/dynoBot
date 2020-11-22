const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	/**
	 * Plays an audio file that is referenced in the config file when the bot joins a voice channel
	 * @param {object} oVoiceConnection The active voice connection
	 * @param {string} sServerId The id of the server
	 */
	playJoinMessage: function(oVoiceConnection, sServerId) {
		let oConfig = configHandler.readJSON(base + "/cfg/config.json", sServerId),
			bJoinMessageEnabled = oConfig.voice_join_message.enabled,
			sJoinMessagePath = oConfig.voice_join_message.path;

		if (bJoinMessageEnabled) {
			oVoiceConnection.getApiConnection().play(sJoinMessagePath);
		}
	}
};
