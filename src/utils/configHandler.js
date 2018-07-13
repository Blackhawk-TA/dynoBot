const fs = require("fs");
const base = require("path").resolve(".");

const HookUpdater = require(base + "/src/core/hook-modules/HookUpdater");

const pathCfg = base + "/cfg/servers/";

/**
 * Utils module optimized for re-use in custom js modules to allow json config handling
 * @type {{readJSON: module.exports.readJSON, editJSON: module.exports.editJSON}}
 */
var self = module.exports = {
	/**
	 * Reads from a json file. Looks for server-specific file first and falls back to default file on the pre-defined path
	 * @param {string} defaultPath The non-server-specific base config file path, used if no server-specific file found
	 * @param {int} serverId The id of the server the bot is currently running on
	 * @param {string} id (optional) The outer JSON entry, can be used without entry
	 * @param {string} entry (optional) The entry of the JSON array within the id
	 * @return {*} The value of the json entry when id and entry are set, else the entire json file.
	 */
	readJSON: function (defaultPath, serverId, id = null, entry = null) {
		var pathArray = defaultPath.split("/");
		var configName = pathArray[pathArray.length - 1];
		var configPath = pathCfg + serverId + "/" + configName;
		var defaultFile = require(defaultPath);

		if (fs.existsSync(configPath)) {
			var serverConfig = require(configPath);

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
			return entry && defaultFile[id] && defaultFile[id][entry] != null ? defaultFile[id][entry] : defaultFile;
		}
	},

	/**
	 * Edits a server-specific JSON file (creates one from the base config if it doesn't exist)
	 * @param {Object} channel The channel where the message for the edit command was sent in
	 * @param {string} configPath The non-server-specific base config file path
	 * @param {string} id The id of the JSON array where editing takes place in
	 * @param {string} entry The name of the entry which shall be edited
	 * @param {*} value The value that is assigned to the entry
	 */
	editJSON: function (channel, configPath, id, entry, value) {
		var pathArray = configPath.split("/");
		var configName = pathArray[pathArray.length - 1];
		var guildId = channel.guild.id;
		var pathServer = pathCfg + guildId + "/";
		var pathJSON = pathServer + configName;
		var jsonString = "";

		//Create directory
		if (!fs.existsSync(pathCfg))
			fs.mkdirSync(pathCfg);

		if (!fs.existsSync(pathServer))
			fs.mkdirSync(pathServer);

		if (!fs.existsSync(pathJSON)) { //config does not exist, create new
			var newJSON = {
				[id]: {
					[entry]: value
				}
			};

			jsonString = JSON.stringify(newJSON, null, 4);
		} else { //config exists, edit old one
			var serverJSON = require(pathJSON);

			if (!serverJSON[id]) {
				serverJSON[id] = {
					[entry]: value
				};
			} else {
				serverJSON[id][entry] = value;
			}

			jsonString = JSON.stringify(serverJSON, null, 4);
		}

		fs.writeFile(pathJSON, jsonString, "utf-8", function (err) {
			if (err) throw err;
			channel.send("Successfully changed " + entry + " to " + value + ".\n```json\n" + jsonString + "```");
		});

		//Trigger hook when enabling
		if (entry === "running" && configName === "hooks.json") {
			var interval = self.readJSON(configPath, channel.guild.id, id, "interval");
			const hookUpdater = new HookUpdater(id, interval, channel.guild);
			setTimeout(() => {
				hookUpdater.nextCall()
			}, interval);
		}
	},

	/**
	 * Overrides an existing server-specific JSON file
	 * @param {Object} channel The channel where the message for the edit command was sent in
	 * @param {string} configPath The non-server-specific base config file path
	 * @param {Object} newJSON The JSON-File that overrides the existing file
	 */
	overrideJSON: function (channel, configPath, newJSON) {
		var pathArray = configPath.split("/");
		var configName = pathArray[pathArray.length - 1];
		var guildId = channel.guild.id;
		var pathServer = pathCfg + guildId + "/";
		var pathJSON = pathServer + configName;

		//Create directory
		if (!fs.existsSync(pathCfg))
			fs.mkdirSync(pathCfg);

		if (!fs.existsSync(pathServer))
			fs.mkdirSync(pathServer);

		var jsonString = JSON.stringify(newJSON, null, 4);
		fs.writeFile(pathJSON, jsonString, "utf-8", function (err) {
			if (err) throw err;
			channel.send("Successfully edited the json file.\n```json\n" + jsonString + "```");
		});
	}
};