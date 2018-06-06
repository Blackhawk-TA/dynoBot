const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

const base = path.resolve(".");

const config = require(base + "/cfg/config.json");
const hooks = require(base + "/cfg/hooks.json");

const pathCfg = base + "/cfg/servers/";

module.exports = {
	readJSON: function (name, guildId, entry = null) {
		var configPath = pathCfg + guildId + "/" + name + ".json";
		var defaultFile;

		if (name === "hooks")
			defaultFile = hooks;
		else
			defaultFile = config;

		if (fs.existsSync(configPath)) {
			var serverConfig = require(configPath);
			return entry ? serverConfig[entry] : serverConfig;
		} else {
			return entry ? defaultFile[entry] : defaultFile;
		}
	},
	editJSON: function (channel, configType, id, entry, value) {
		var guildId = channel.guild.id;
		var pathServer = pathCfg + guildId;
		var pathJSON = pathServer + "/" + configType + ".json";
		var jsonString = "";

		if (!fs.existsSync(pathServer)) {
			mkdirp(pathServer, function (err) {
				if (err) console.error(err);
			});
		}

		if (!fs.existsSync(pathJSON)) { //config does not exist, create new
			var newJSON = {
				[id]: {
					[entry]: value
				}
			};

			jsonString = JSON.stringify(newJSON, null, 4);
		} else { //config exists, edit old one
			var serverJSON = require(pathJSON);

			if (serverJSON[id] === undefined) {
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
		})
	}
};