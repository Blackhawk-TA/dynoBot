const fs = require("fs");

const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/modules/rconServer.json";

module.exports = {
	run: function (msg, client, regexGroups) {
		let serverCfgPath = base + "/cfg/servers/" + msg.getServer().getId() + "/rconServer.json";
		let serverCfg = {};

		if (fs.existsSync(serverCfgPath)) {
			serverCfg = require(serverCfgPath);
		}

		let serverName = regexGroups[1];

		if (!serverCfg[serverName]) {
			serverCfg[serverName] = {
				"address": "127.0.0.1",
				"port": "27015",
				"password": "password",
				"rcon_password": "rcon_password"
			};
			configHandler.overrideJSON(msg.getTextChannel(), cfgPath, serverCfg);

			console.log(`${new Date().toLocaleString()}: Added rcon server '${serverName}' on ${msg.getServer().getId()}.`);
			msg.getTextChannel().send(`Added the server '${serverName}'. Please set the address, port, password and rcon password using the 'set rcon config' command.`);
		} else {
			msg.getTextChannel().send(`A server with the name ${serverName} already exists.`);
		}
	}
};
