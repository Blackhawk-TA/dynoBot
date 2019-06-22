const fs = require("fs");

const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const pathCfg = base + "/cfg/moduleConfigs/rconServer.json";

module.exports = {
	run: function (msg) {
		let serverCfgPath = base + "/cfg/servers/" + msg.getServer().getId() + "/rconServer.json";
		let serverCfg = {};

		if (fs.existsSync(serverCfgPath)) {
			serverCfg = require(serverCfgPath);

			let contentArray = msg.getContentArray(true),
				id = contentArray[3],
				entry = contentArray[4],
				value = contentArray[6];

			if (entry === "rcon_password") {
				msg.getChannel().send("I've deleted your message for security reasons.\nThere is a specific command for setting the rcon password. Check help for further information.");
				if (msg.isDeletable()) {
					msg.delete();
				}
			} else {
				if (serverCfg[id] && serverCfg[id][entry]) {
					configHandler.editJSON(msg.getChannel(), pathCfg, id, entry, value);
				} else {
					msg.getChannel().send(`Sorry, but the config entry ${id}.${entry} does not exist.`);
				}
			}
		} else {
			msg.getChannel().send("Sorry, this server has no rcon server config, please create one using the rcon add command.");
		}
	}
};