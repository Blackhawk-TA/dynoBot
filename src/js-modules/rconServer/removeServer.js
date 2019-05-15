const fs = require("fs");

const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/moduleConfigs/rconServer.json";

module.exports = {
	run: function (msg) {
		var serverCfgPath = base + "/cfg/servers/" + msg.guild.id + "/rconServer.json";

		if (fs.existsSync(serverCfgPath)) {
			var serverCfg = require(serverCfgPath);
			var serverName = msg.contentArray[1];

			delete serverCfg[serverName];

			configHandler.overrideJSON(msg.channel, cfgPath, serverCfg);

			console.log(`${new Date().toLocaleString()}: Removed rcon server '${serverName}' on ${msg.guild.id}.`);
			msg.channel.send(`The server '${serverName}' has been removed.`);
		} else {
			msg.channel.send("There is no server registered yet. Use the 'rcon server_name add' command to register one.");
		}
	}
};
