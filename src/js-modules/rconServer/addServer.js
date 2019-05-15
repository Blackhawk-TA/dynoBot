const fs = require("fs");

const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/moduleConfigs/rconServer.json";

module.exports = {
	run: function (msg) {
		var serverCfgPath = base + "/cfg/servers/" + msg.guild.id + "/rconServer.json";
		var serverCfg = {};

		if (fs.existsSync(serverCfgPath)) {
			serverCfg = require(serverCfgPath);
		}

		var serverName = msg.contentArray[1];

		serverCfg[serverName] = {
			"address": "127.0.0.1",
			"port": "27015",
			"password": "password",
			"rcon_password": "rcon_password"
		};
		configHandler.overrideJSON(msg.channel, cfgPath, serverCfg);

		console.log(`${new Date().toLocaleString()}: Added rcon server '${serverName}' on ${msg.guild.id}.`);
		msg.channel.send(`Added the server '${serverName}'. Please set the address, port, password and rcon password using the 'set rcon config' command.`);
	}
};
