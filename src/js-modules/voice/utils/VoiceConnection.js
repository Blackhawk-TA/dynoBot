const ytPlaylist = require("ytpl");
const ytSearch = require("ytsr");

class VoiceConnection {
	_aPlaylist;
	_oConnection;
	_sId;

	/**
	 * Constructor
	 * @param connection The connection object from the dynoBot-Framework
	 */
	constructor(connection) {
		this._aPlaylist = ["https://www.youtube.com/watch?v=P_FCuMAl8oA"];
		this._oConnection = connection;
		this._sId = connection.getVoiceChannel().getId();
	}

	getId() {
		return this._sId;
	}

	getApiConnection() {
		return this._oConnection;
	}

	getPlaylist() {
		return this._aPlaylist;
	}

	getCurrentTitle() {
	}

	clearPlaylist() {
		this._aPlaylist = [];
	}

	addTitle() {
	}

	removeTitle() {
	}

	addPlaylist() {
	}

	skipTitle() {
	}

	playNext() {
	}

	playNow() {
	}
}

module.exports = VoiceConnection;
