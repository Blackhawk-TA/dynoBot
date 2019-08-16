const fs = require("fs");
const base = require("path").resolve(".");

const HookUpdater = require(base + "/src/core/hook-modules/HookUpdater");

const pathCfg = base + "/cfg/servers/";

/**
 * Utils module optimized for re-use in custom js modules to allow json config handling
 * @type {{readJSON: module.exports.readJSON, editJSON: module.exports.editJSON, overrideJSON: module.exports.overrideJSON}}
 */
module.exports = {
	/**
	 * Reads from a json file. Looks for server-specific file first and falls back to default file on the pre-defined path
	 * @param {string} defaultPath - The non-server-specific base config file path, used if no server-specific file found
	 * @param {int} serverId - The id of the server the bot is currently running on
	 * @param {string} id (optional) - The outer JSON entry, can be used without entry
	 * @param {string} entry (optional) - The entry of the JSON array within the id
	 * @return {*} The value of the json entry when id and entry are set, else the entire json file.
	 */
	readJSON: function (defaultPath, serverId, id = "", entry = "") {
		let pathArray = defaultPath.split("/");
		let configName = pathArray[pathArray.length - 1];
		let configPath = pathCfg + serverId + "/" + configName;
		let defaultFile = require(defaultPath);

		if (fs.existsSync(configPath)) {
			let serverConfig = require(configPath);

			if (id && entry && defaultFile[id] && defaultFile[id][entry] != null) {
				if (serverConfig[id] && entry) {
					return serverConfig[id][entry] != null ? serverConfig[id][entry] : defaultFile[id][entry];
				} else {
					return defaultFile[id][entry];
				}
			} else if (id && !entry && defaultFile[id]) {
				if (serverConfig[id] && entry) {
					return serverConfig[id] ? serverConfig[id] : defaultFile[id];
				} else {
					return defaultFile[id];
				}
			} else {
				return serverConfig;
			}
		} else {
			if (defaultFile[id]) {
				return defaultFile[id][entry] != null ? defaultFile[id][entry] : defaultFile[id];
			} else {
				return defaultFile;
			}
		}
	},

	/**
	 * Edits a server-specific JSON file (creates one from the base config if it doesn't exist)
	 * @param {Object} channel - The channel where the message for the edit command was sent in
	 * @param {string} configPath - The non-server-specific base config file path
	 * @param {string} id - (can be null) The id of the JSON array where editing takes place in
	 * @param {string} entry - The name of the entry which shall be edited
	 * @param {*} value - The value that is assigned to the entry
	 * @param {boolean} showResult - Determines if the edited json file should be shown once editing is done
	 */
	editJSON: function (channel, configPath, id, entry, value, showResult = true) {
		let pathArray = configPath.split("/");
		let configName = pathArray[pathArray.length - 1];
		let serverId = channel.getServer().getId();
		let pathServer = pathCfg + serverId + "/";
		let pathJSON = pathServer + configName;
		let jsonString = "";

		//Create directory
		if (!fs.existsSync(pathCfg))
			fs.mkdirSync(pathCfg);

		if (!fs.existsSync(pathServer))
			fs.mkdirSync(pathServer);

		if (!fs.existsSync(pathJSON)) { //config does not exist, create new
			let newJSON;
			if (!id) {
				newJSON = {
					[entry]: value
				};
			} else {
				newJSON = {
					[id]: {
						[entry]: value
					}
				};
			}

			jsonString = JSON.stringify(newJSON, null, 4);
		} else { //config exists, edit old one
			let serverJSON = require(pathJSON);

			if (!id) {
				serverJSON[entry] = value;
			} else {
				if (!serverJSON[id]) {
					serverJSON[id] = {
						[entry]: value
					};
				} else {
					serverJSON[id][entry] = value;
				}
			}

			jsonString = JSON.stringify(serverJSON, null, 4);
		}

		//In case of rcon password change censor it.
		let censoredJson = jsonString.replace(/"rcon_password": "(.+)"/g, `"rcon_password": "********"`);

		fs.writeFile(pathJSON, jsonString, "utf-8", function (err) {
			if (err) throw err;
			if (showResult) {
				channel.send("Successfully changed " + entry + " of " + id + " to " + value + ".\n```json\n" + censoredJson + "```");
			} else {
				channel.send(`Successfully changed ${entry} of ${id}.`);
			}
		});

		//Trigger hook when enabling
		if (entry === "running" && configName === "hooks.json") {
			let interval = this.readJSON(configPath, channel.getServer().getId(), id, "interval");
			const hookUpdater = new HookUpdater(id, interval, channel.getServer());
			setTimeout(() => {
				hookUpdater.nextCall();
			}, interval);
		}
	},

	/**
	 * Overrides an existing server-specific JSON file
	 * @param {Object} channel - The channel where the message for the edit command was sent in
	 * @param {string} configPath - The non-server-specific base config file path
	 * @param {Object} newJSON - The JSON-File that overrides the existing file
	 * @param {boolean} showResult - This sets whether the new json file is shown in discord, default value is true
	 */
	overrideJSON: function (channel, configPath, newJSON, showResult = true) {
		let pathArray = configPath.split("/");
		let configName = pathArray[pathArray.length - 1];
		let serverId = channel.getServer().getId();
		let pathServer = pathCfg + serverId + "/";
		let pathJSON = pathServer + configName;

		//Create directory
		if (!fs.existsSync(pathCfg))
			fs.mkdirSync(pathCfg);

		if (!fs.existsSync(pathServer))
			fs.mkdirSync(pathServer);

		let jsonString = JSON.stringify(newJSON, null, 4);

		fs.writeFile(pathJSON, jsonString, "utf-8", function (err) {
			if (err) throw err;
			let censoredJson = jsonString.replace(/"rcon_password": "(.+)"/g, `"rcon_password": "********"`);
			if (showResult) {
				channel.send("This is the new json file:\n```json\n" + censoredJson + "```");
			}
		});
	}
};