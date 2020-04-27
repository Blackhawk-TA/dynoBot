let aVoiceConnections = [];

module.exports = {
	/**
	 * Gets a connection object by its channel id.
	 * @param sChannelId The id of the voice channel that is assigned to the connection
	 * @return {object} The connection object
	 */
	getConnection: function(sChannelId) {
		let i = 0;
		while (i < aVoiceConnections.length) {
			if (aVoiceConnections[i].getVoiceChannel().getId() === sChannelId) {
				return aVoiceConnections[i];
			}
			i++;
		}
	},

	/**
	 * Registers the connection which is an instance of the VoiceConnection class.
	 * @param oVoiceConnection The voice connection object
	 */
	registerConnection: function(oVoiceConnection) {
		aVoiceConnections.push(oVoiceConnection);
	},

	/**
	 * Unregisters the connection.
	 * @param sId The id of the active voice connection
	 * @return {array} The connection that was removed
	 */
	unregisterConnection: function(sId) {
		let i = 0;
		while (i < aVoiceConnections.length) {
			if (aVoiceConnections[i].getId() === sId) {
				return aVoiceConnections.splice(i, 1);
			}
			i++;
		}
	}
};
