const fs = require("fs");
const base = require("path").resolve(".");

const HookUpdater = require(base + "/src/core/hook-modules/HookUpdater");

const pathCfg = base + "/cfg/servers/";

var self = module.exports = {
	readJSON: function (defaultPath, serverId, id = null, entry = null) {
		var nameHelper = defaultPath.split("/");
		var name = nameHelper[nameHelper.length - 1];
		var configPath = pathCfg + serverId + "/" + name;
		var defaultFile = require(defaultPath);

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
		if (entry === "running" && configType === "hooks") {
			var interval = self.readJSON(base + "/cfg/hooks.json", channel.guild.id, id, "interval");
			const hookUpdater = new HookUpdater(id, interval, channel.guild);
			setTimeout(() => {
				hookUpdater.nextCall()
			}, interval);
		}
	}
};