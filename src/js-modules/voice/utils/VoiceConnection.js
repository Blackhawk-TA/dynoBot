const ytDownload = require("ytdl-core");
const ytPlaylist = require("youtube-playlist-info");
const ytSearch = require("youtube-search");
const playlistImporter = require("playlist-importer-lite");

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
		this._sCurrentTitleUrl = "";
		this._sCurrentTitleName = "";
	}

	/**
	 * Gets the id of the voice connection.
	 * @return {number} The id of the voice connection
	 */
	getId() {
		return this._oConnection.getVoiceChannel().getId();
	}

	/**
	 * Gets the api connection with all the commands necessary for handling voice playback.
	 * @return {object} The api connection
	 */
	getApiConnection() {
		return this._oConnection;
	}

	/**
	 * Gets the current playlist with the title names only.
	 * @return {string[]} The playlist
	 */
	getPlaylist() {
		let aNamePlaylist = [];
		this._aPlaylist.forEach(oTitle => {
			aNamePlaylist.push(oTitle.name);
		});
		return aNamePlaylist;
	}

	/**
	 * Gets the name of the title which is currently playing.
	 * @return {string} The name of the current title
	 */
	getCurrentTitleName() {
		return this._sCurrentTitleName;
	}

	/**
	 * Gets the url of the title which is currently playing.
	 * @return {string} The url of the current title
	 */
	getCurrentTitleUrl() {
		return this._sCurrentTitleUrl;
	}

	/**
	 * Removes the first item of the playlist and plays it.
	 * Buffers the next title
	 */
	play() {
		if (this._aPlaylist.length > 0) {
			let oCurrentTitle = this._aPlaylist.shift();
			this._sCurrentTitleUrl = oCurrentTitle.url;
			this._sCurrentTitleName = oCurrentTitle.name;

			this._oConnection.play(ytDownload(this._sCurrentTitleUrl, {
				filter: "audioonly",
				quality: "highestaudio",
				highWaterMark: ONE_MEGABYTE
			}));

			//Plays the next title when the previous one ended
			this._oConnection.onEvent("end", this.play.bind(this));
		} else {
			this._sCurrentTitleUrl = "";
			this._sCurrentTitleName = "";
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
	 * @param {object} oTitle The title object
	 * @param {string} oTitle.name The name of the title
	 * @param {string} oTitle.url The url of the title
	 */
	addTitle(oTitle) {
		this._aPlaylist.push(oTitle);

		if (!this._sCurrentTitleUrl) {
			this.play();
		}
	}

	/**
	 * Adds the given title as next one in the playlist and plays it directly
	 * @param {object} oTitle The title object
	 * @param {string} oTitle.name The name of the title
	 * @param {string} oTitle.url The url of the title
	 */
	addCurrentTitle(oTitle) {
		this._aPlaylist.unshift(oTitle);

		//Prevent play from being triggered twice
		this._oConnection.removeAllListeners("end");
		this.play();
	}

	/**
	 * Adds the given title as next one in the playlist
	 * @param {object} oTitle The title object
	 * @param {string} oTitle.name The name of the title
	 * @param {string} oTitle.url The url of the title
	 */
	addNextTitle(oTitle) {
		this._aPlaylist.unshift(oTitle);

		if (!this._sCurrentTitleUrl) {
			this.play();
		}
	}

	/**
	 * Gets the title of the video by its url
	 * @param {string} url The url of the video
	 * @return {Promise<object>} The title object containing the name and url
	 */
	getTitle(url) {
		return new Promise((resolve, reject) => {
			ytDownload.getBasicInfo(url).then(info => {
				let oTitle = {
					name: info.title,
					url: url
				}

				resolve(oTitle);
			}).catch(err => {
				reject(err);
			});
		});
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
	 * @return {Promise} The promise stating if it was successful or not
	 */
	addPlaylist(playlistId) {
		return new Promise((resolve, reject) => {
			const options = {
				maxResults: 100
			};

			ytPlaylist(security.googleAPI, playlistId, options).then(items => {
				items.forEach(track => {
					this._aPlaylist.push({
						name: track.title,
						url: "https://www.youtube.com/watch?v=" + track.resourceId.videoId
					});
				});

				if (!this._sCurrentTitleUrl) {
					this.play();
				}
				resolve();
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
	 * Searches the title on YouTube and returns the url
	 * @param {string} name
	 * @return {Promise<string>} The YouTube url of the title
	 */
	searchTitle(name) {
		const options = {
			maxResults: 1,
			key: security.googleAPI
		};

		return new Promise((resolve, reject) => {
			ytSearch(name, options, function(err, results) {
				if (err) {
					console.error(`${new Date().toLocaleString()}: ${err}`);
					reject(err);
				} else {
					resolve({
						name: results[0].title,
						url: results[0].link
					});
				}
			});
		});
	}

	importPlaylist(url) {
		return new Promise((resolve, reject) => {
			playlistImporter.getPlaylistData(url).then(data => {
				let sQuery;
				data.tracklist.forEach(track => {
					sQuery = track.title + " " + track.artist;
					console.log(sQuery);
				});
				resolve();
			}).catch(err => {
				console.error(`${new Date().toLocaleString()}: ${err}`);
				reject(err);
			});
		});
	}
}

module.exports = VoiceConnection;
