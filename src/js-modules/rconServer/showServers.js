const fs = require("fs");

const base = require("path").resolve(".");

module.exports = {
	run: function (msg) {
		var serverCfgPath = base + "/cfg/servers/" + msg.guild.id + "/rconServer.json";

		if (fs.existsSync(serverCfgPath)) {
			var serverCfg = require(serverCfgPath);

			var jsonString = JSON.stringify(serverCfg, null, 4);
			var censoredJson = jsonString.replace(/"rcon_password": "(.+)"/g, `"rcon_password": "********"`);

			msg.channel.send("This is your current rcon server configuration:\n```json\n" + censoredJson + "```The rcon_password is censored due to security reasons.");

		} else {
			msg.channel.send("There is no server registered yet. Use the 'rcon server_name add' command to register one.");
		}
	}
};
