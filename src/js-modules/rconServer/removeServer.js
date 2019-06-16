const fs = require("fs");

const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/moduleConfigs/rconServer.json";

module.exports = {
	run: function (msg) {
		let serverCfgPath = base + "/cfg/servers/" + msg.getServer().getId() + "/rconServer.json";

		if (fs.existsSync(serverCfgPath)) {
			let serverCfg = require(serverCfgPath);
			let serverName = msg.getContentArray() [1];

			delete serverCfg[serverName];

			configHandler.overrideJSON(msg.channel, cfgPath, serverCfg);

			console.log(`${new Date().toLocaleString()}: Removed rcon server '${serverName}' on ${msg.getServer().getId()}.`);
			msg.channel.send(`The server '${serverName}' has been removed.`);
		} else {
			msg.channel.send("There is no server registered yet. Use the 'rcon server_name add' command to register one.");
		}
	}
};
