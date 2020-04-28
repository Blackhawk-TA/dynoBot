const ytDownload = require("ytdl-core");
const ytPlaylist = require("ytpl");
const ytSearch = require("ytsr");

class VoiceConnection {
	/**
	 * The constructor.
	 * @param connection The connection object from the dynoBot-Framework
	 */
	constructor(connection) {
		this._aPlaylist = [];
		this._oConnection = connection;
		this._sCurrentTitle = "";
		this._sId = connection.getVoiceChannel().getId();
	}

	/**
	 * Gets the id of the voice connection.
	 * @return {number} The id of the voice connection
	 */
	getId() {
		return this._sId;
	}

	/**
	 * Gets the api connection with all the commands necessary for handling voice playback.
	 * @return {object} The api connection
	 */
	getApiConnection() {
		return this._oConnection;
	}

	/**
	 * Gets the current playlist.
	 * @return {string[]} The playlist
	 */
	getPlaylist() {
		return this._aPlaylist;
	}

	/**
	 * Gets the title which is currently playing.
	 * @return {string} The current title
	 */
	getCurrentTitle() {
		return this._sCurrentTitle;
	}

	/**
	 * Removes the first item of the playlist and plays it.
	 */
	play() {
		this._sCurrentTitle = this._aPlaylist.shift();
		this._oConnection.play(ytDownload(this._sCurrentTitle, {
			filter: "audioonly",
			quality: "highestaudio"
		}));
	}

	/**
	 * Clears the playlist
	 */
	clearPlaylist() {
		this._aPlaylist = [];
	}

	/**
	 * Adds the given title to the end of the playlist
	 * @param {string} url The url to the title
	 */
	addTitle(url) {
		this._aPlaylist.push(url);
	}

	/**
	 * Adds the given title as next one in the playlist
	 * @param {string} url The url to the title
	 */
	addNextTitle(url) {
		this._aPlaylist.unshift(url);
	}

	/**
	 * Removes the title from the playlist at the given index
	 * @param {number} index The index of the title in the playlist
	 */
	removeTitle(index) {
		this._aPlaylist.splice(index, 1);
	}

	/**
	 * Adds a YouTube playlist to the current playlist
	 * @param {string} url The url of the playlist
	 */
	addPlaylist(url) {
	}
}

module.exports = VoiceConnection;
