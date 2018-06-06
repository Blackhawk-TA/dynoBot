const fs = require("fs");
const mkdirp = require("mkdirp");

const config = require("./../../cfg/config.json");
const hooks = require("./../../cfg/hooks.json");

const path = "cfg/servers/";

module.exports = {
	readJSON: function(name, guildId, entry = null) {
		var configPath = path + guildId + "/" + name + ".json";
		var defaultFile;

		if (name === "hooks")
			defaultFile = hooks;
		else
			defaultFile = config;

		if (fs.exists(configPath)) {
			var serverConfig = require(configPath);
			return entry ? serverConfig[entry] : serverConfig;
		} else {
			return entry ? defaultFile[entry] : defaultFile;
		}
	},
	editJSON: function(guildId, name, index, entry, value) {
		var pathServer = path + guildId;
		var pathJSON = pathServer + "/" + name + ".json";

		if (!fs.exists(pathServer)) {
			mkdirp(pathServer, function (err) {
				if (err) console.error(err);
			});
		}

		if (!fs.exists(pathJSON)) {
			var templateJSON = {};

			fs.writeFile(pathJSON, JSON.stringify(templateJSON, null, 4), "utf-8", function (err) {
				if (err) throw err;
			})
		}

		var serverJSON = require(pathJSON);
		serverJSON[index][entry] = value;

		fs.writeFile(serverJSON, JSON.stringify(serverJSON, null, 4), "utf-8", function (err) {
			if (err) throw err;
			channel.send("Successfully changed " + entry + " to " + value + ".\n```json\n" + jsonString + "```");
		})
	}
};