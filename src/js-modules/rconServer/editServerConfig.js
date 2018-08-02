const fs = require("fs");

const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const pathCfg = base + "/cfg/moduleConfigs/rconServer.json";

module.exports = {
	run: function (msg) {
		var serverCfgPath = base + "/cfg/servers/" + msg.guild.id + "/rconServer.json";
		var serverCfg = {};

		if (fs.existsSync(serverCfgPath)) {
			serverCfg = require(serverCfgPath);

			var id = msg.contentArray[3];
			var entry = msg.contentArray[4];
			var value = msg.contentArray[6];

			if (entry === "rcon_password") {
				msg.channel.send("There is a specific command for setting the rcon password. Check help for further information.")
			} else {
				if (serverCfg[id] && serverCfg[id][entry]) {
					configHandler.editJSON(msg.channel, pathCfg, id, entry, value);
				} else {
					msg.channel.send(`Sorry, but the config entry ${id}.${entry} does not exist.`);
				}
			}
		} else {
			msg.channel.send("Sorry, this server has no rcon server config, please create one using the rcon add command.");
		}
	}
};