const ytDownload = require("ytdl-core");
const ytPlaylist = require("ytpl");
const ytSearch = require("youtube-search");

const base = require("path").resolve(".");
const security = require(base + "/cfg/security.json");
const ONE_MEGABYTE = 10485760;

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
	 * Buffers the next title
	 */
	play() {
		if (this._aPlaylist.length > 0) {
			this._sCurrentTitle = this._aPlaylist.shift();

			this._oConnection.play(ytDownload(this._sCurrentTitle, {
				filter: "audioonly",
				quality: "highestaudio",
				highWaterMark: ONE_MEGABYTE
			}));

			//Plays the next title when the previous one ended
			this._oConnection.onEvent("end", () => {
				this.play();
			});
		} else {
			this._sCurrentTitle = "";
		}
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

		if (!this._sCurrentTitle) {
			this.play();
		}
	}

	/**
	 * Adds the title as next one in the playlist and plays it directly
	 * @param {string} url The url to the title
	 */
	addCurrentTitle(url) {
		this._aPlaylist.unshift(url);
		this.play();
	}

	/**
	 * Adds the given title as next one in the playlist
	 * @param {string} url The url to the title
	 */
	addNextTitle(url) {
		this._aPlaylist.unshift(url);

		if (!this._sCurrentTitle) {
			this.play();
		}
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
	 * @param {string} playlistId The id of the playlist
	 */
	addPlaylist(playlistId) {
		return new Promise((resolve, reject) => {
			ytPlaylist(playlistId).then(function(playlist) {
				playlist.items.forEach(title => {
					this._aPlaylist.push(title.url_simple);
				}).bind(this);
				resolve();
			}).catch(error => {
				console.error(`${new Date().toLocaleString()}: ${error}`);
				reject();
			});
		});
	}

	/**
	 * Searches the title on YouTube and returns the url
	 * @param name
	 */
	searchTitle(name) {
		const options = {
			maxResults: 1,
			key: security.googleAPI
		};

		return new Promise((resolve, reject) => {
			ytSearch(name, options, function(err, results) {
				if(err) {
					reject(error);
				} else {
					resolve(results[0].link);
				}
			});
		});
	}
}

module.exports = VoiceConnection;
