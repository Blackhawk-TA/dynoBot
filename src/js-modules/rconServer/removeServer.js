const fs = require("fs");

const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/modules/rconServer.json";
const logger = require(base + "/src/utils/logger");

module.exports = {
	run: function (msg, client, regexGroups) {
		let serverCfgPath = base + "/cfg/servers/" + msg.getServer().getId() + "/rconServer.json";

		if (fs.existsSync(serverCfgPath)) {
			let serverCfg = require(serverCfgPath);
			let serverName = regexGroups[1];

			delete serverCfg[serverName];

			configHandler.overrideJSON(msg.getTextChannel(), cfgPath, serverCfg);

			logger.info(`Removed rcon server '${serverName}' on ${msg.getServer().getId()}.`);
			msg.getTextChannel().send(`The server '${serverName}' has been removed.`);
		} else {
			msg.getTextChannel().send("There is no server registered yet. Use the 'rcon server_name add' command to register one.");
		}
	}
};
