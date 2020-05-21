const fs = require("fs");

const base = require("path").resolve(".");

module.exports = {
	run: function (msg) {
		let serverCfgPath = base + "/cfg/servers/" + msg.getServer().getId() + "/rconServer.json";

		if (fs.existsSync(serverCfgPath)) {
			let serverCfg = require(serverCfgPath);

			let jsonString = JSON.stringify(serverCfg, null, 4);
			let censoredJson = jsonString.replace(/"rcon_password": "(.+)"/g, `"rcon_password": "********"`);

			msg.getTextChannel().send("This is your current rcon server configuration:\n```json\n" + censoredJson + "```The rcon_password is censored due to security reasons.");

		} else {
			msg.getTextChannel().send("There is no server registered yet. Use the 'rcon server_name add' command to register one.");
		}
	}
};
