const ytDownload = require("ytdl-core");
const scrapeYouTube = require("scrape-yt").scrapeYt;
const playlistImporter = require("playlist-importer-lite");
const amply = require("apple-music-playlist");

const connectionsHandler = require("./connectionsHandler");

const ONE_MEGABYTE = 10485760;
const FIVE_MINUTES_IN_MS = 300000;

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
		this._bErrorEventAttached = false;

		setInterval(this._disconnect.bind(this), FIVE_MINUTES_IN_MS);
	}

	/**
	 * Disconnects from the voice channel, called by interval
	 * @private
	 */
	_disconnect() {
		let aChannelMembers = this._oConnection.getVoiceChannel().getMembers();
		if (aChannelMembers.length === 1) {
			connectionsHandler.unregisterConnection(this.getId());
		}
	}

	/**
	 * Initializes and attaches the error to the voice connection
	 * @private
	 */
	_initErrorEvent() {
		if (!this._bErrorEventAttached) {
			this._oConnection.onEvent("error", function(err) {
				console.error(`${new Date().toLocaleString()}: ${err}`);
				this._bErrorEventAttached = true;
			}.bind(this));
		}
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
		this._initErrorEvent();
		if (this._aPlaylist.length > 0) {
			//Prevent event from being registered twice
			this._oConnection.removeAllListeners("end");

			let oCurrentTitle = this._aPlaylist.shift();
			this._sCurrentTitleUrl = oCurrentTitle.url;
			this._sCurrentTitleName = oCurrentTitle.name;

			this._oConnection.play(ytDownload(this._sCurrentTitleUrl, {
				filter: "audioonly",
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
	 * @return {Promise<object|Error>} On resolve the title object containing the name and url, on reject the error
	 */
	getTitle(url) {
		return new Promise((resolve, reject) => {
			ytDownload.getBasicInfo(url).then(info => {
				let oTitle = {
					name: info.title,
					url: url
				};

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
	 * @return {Promise<void|Error>} On resolve it returns nothing, on reject the error
	 */
	addPlaylist(playlistId) {
		return new Promise((resolve, reject) => {
			scrapeYouTube.getPlaylist(playlistId).then(oPlaylist => {
				oPlaylist.videos.forEach(track => {
					if (track.id && track.title) {
						this._aPlaylist.push({
							name: track.title,
							url: "https://www.youtube.com/watch?v=" + track.id
						});
					} else {
						console.error(`${new Date().toLocaleString()}: Could not find title from YouTube playlist.`);
					}
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
	 * @return {Promise<string|Error>} On resolve the YouTube url of the title, on reject the error
	 */
	searchTitle(name) {
		let options = {
			type: "video",
			limit: 1
		};

		return new Promise((resolve, reject) => {
			scrapeYouTube.search(name, options).then(aResults => {
				let oResult = aResults[0];
				if (oResult && oResult.title && oResult.id) {
					resolve({
						name: oResult.title,
						url: "https://www.youtube.com/watch?v=" + oResult.id
					});
				} else {
					reject(new Error(`Title '${name}' not found on YouTube.`));
				}
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
	 * Search each track in the list and adds the Youtube links to the playlist
	 * @param {object[]} tracks The track to be added to the playlist
	 * @return {Promise<void|Error>} On resolve it returns nothing, on reject the error
	 */
	searchAndAddTracks(tracks) {
		return new Promise((resolve, reject) => {
			let sQuery,
				aPromises = [];

			tracks.forEach(function(track) {
				sQuery = track.title + " " + track.artist;
				aPromises.push(this.searchTitle(sQuery));
			}.bind(this));

			Promise.all(aPromises).then(function(aResult) {
				aResult.forEach(oTitle => {
					this._aPlaylist.push(oTitle);
				});
				if (!this._sCurrentTitleUrl) {
					this.play();
				}
				resolve();
			}.bind(this)).catch(err => {
				reject(err);
			});
		});
	}

	/**
	 * Adds the given spotify playlist to the bots playlist
	 * @param {string} url The spotify playlist url
	 * @return {Promise<void|Error>} On resolve it returns nothing, on reject the error
	 */
	addSpotifyPlaylist(url) {
		return new Promise((resolve, reject) => {
			playlistImporter.getPlaylistData(url).then(data => {
				this.searchAndAddTracks(data.tracklist).then(() => {
					resolve();
				}).catch(err => {
					reject(err);
				});
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
	 * Adds the given apple music playlist to the bots playlist
	 * @param {string} url The apple music playlist url
	 * @return {Promise<void|Error>} On resolve it returns nothing, on reject the error
	 */
	addAppleMusicPlaylist(url) {
		return new Promise((resolve, reject) => {
			amply.getPlaylist(url).then(aResults => {
				this.searchAndAddTracks(aResults).then(() => {
					resolve();
				}).catch(err => {
					reject(err);
				});
			}).catch(err => {
				reject(err);
			});
		});
	}
}

module.exports = VoiceConnection;
