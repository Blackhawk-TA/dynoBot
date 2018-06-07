const fs = require("fs");
const base = require("path").resolve(".");


const configFile = require(base + "/cfg/config.json");
const hooksFile = require(base + "/cfg/hooks.json");

const HookUpdater = require(base + "/src/core/hook-modules/HookUpdater");

const pathCfg = base + "/cfg/servers/";

var self = module.exports = {
	readJSON: function (name, serverId, id = null, entry = null) {
		var configPath = pathCfg + serverId + "/" + name + ".json";
		var defaultFile;

		if (name === "hooks")
			defaultFile = hooksFile;
		else
			defaultFile = configFile;

		if (fs.existsSync(configPath)) {
			var serverConfig = require(configPath);
			if(serverConfig[id] && entry) {
				return serverConfig[id][entry] ? serverConfig[id][entry] : defaultFile[id][entry]
			} else {
				return defaultFile[id][entry];
			}
		} else {
			return entry ? defaultFile[id][entry] : defaultFile;
		}
	},
	editJSON: function (channel, configType, id, entry, value) {
		var guildId = channel.guild.id;
		var pathServer = pathCfg + guildId + "/";
		var pathJSON = pathServer + configType + ".json";
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
		if (entry === "running") {
			var interval = self.readJSON("hooks", channel.guild.id, id, "interval");
			const hookUpdater = new HookUpdater(id, interval, channel.guild);
			setTimeout(() => {
				hookUpdater.nextCall()
			}, interval);
		}
	}
};