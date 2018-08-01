const Rcon = require('node-source-rcon');

const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/moduleConfigs/rconServer.json";

module.exports = {
	run: function (msg) {
		var address = configHandler.readJSON(cfgPath, msg.guild.id, "server_settings", "address");
		var port = configHandler.readJSON(cfgPath, msg.guild.id, "server_settings", "port");
		var password = configHandler.readJSON(cfgPath, msg.guild.id, "server_settings", "password");

		var connectLink = `steam://connect/${address}:${port}/${password}`;
		var connectCmd = `connect ${address}:${port}; password ${password};`;

		msg.channel.send("You can connect to the server using this link: " + connectLink +
			"\n Alternatively you can using following console command:```" + connectCmd + "```");
	}
};