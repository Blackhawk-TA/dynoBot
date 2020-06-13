let aVoiceConnections = [];

module.exports = {
	/**
	 * Gets a connection object by its channel id.
	 * @param {string} sServerId The id of the server on which the voice connection is active
	 * @return {object} The connection object
	 */
	getConnection: function(sServerId) {
		let i = 0;
		while (i < aVoiceConnections.length) {
			if (aVoiceConnections[i].getId() === sServerId) {
				return aVoiceConnections[i];
			}
			i++;
		}
	},

	/**
	 * Registers the connection which is an instance of the VoiceConnection class.
	 * @param {object} oVoiceConnection The voice connection object
	 */
	registerConnection: function(oVoiceConnection) {
		aVoiceConnections.push(oVoiceConnection);
	},

	/**
	 * Unregisters the connection, removes the event listeners and leaves the voice channel
	 * @param {string} sServerId The id of the server on which the voice connection is active
	 * @return {array} The connection that was removed
	 */
	unregisterConnection: function(sServerId) {
		let i = 0,
			oVoiceConnection,
			aAvailableEvents;

		while (i < aVoiceConnections.length) {
			oVoiceConnection = aVoiceConnections[i];
			if (oVoiceConnection.getId() === sServerId) {
				aAvailableEvents = oVoiceConnection.getApiConnection().getAvailableEvents();
				aAvailableEvents.forEach(sEvent => {
					oVoiceConnection.getApiConnection().removeAllListeners(sEvent);
				});
				oVoiceConnection.getApiConnection().end(); //Ends audio stream
				oVoiceConnection.getApiConnection().disconnect();

				return aVoiceConnections.splice(i, 1)[0];
			}
			i++;
		}
	}
};
