const fs = require("fs");

const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/moduleConfigs/rconServer.json";

module.exports = {
	run: function (msg) {
		let serverCfgPath = base + "/cfg/servers/" + msg.getServer().getId() + "/rconServer.json";
		let serverCfg = {};

		if (fs.existsSync(serverCfgPath)) {
			serverCfg = require(serverCfgPath);
		}

		let serverName = msg.getContentArray()[2];

		serverCfg[serverName] = {
			"address": "127.0.0.1",
			"port": "27015",
			"password": "password",
			"rcon_password": "rcon_password"
		};
		configHandler.overrideJSON(msg.channel, cfgPath, serverCfg);

		console.log(`${new Date().toLocaleString()}: Added rcon server '${serverName}' on ${msg.getServer().getId()}.`);
		msg.channel.send(`Added the server '${serverName}'. Please set the address, port, password and rcon password using the 'set rcon config' command.`);
	}
};
