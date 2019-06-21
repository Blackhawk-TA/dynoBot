const fs = require("fs");

const base = require("path").resolve(".");

module.exports = {
	run: function (msg) {
		let serverCfgPath = base + "/cfg/servers/" + msg.getServer().getId() + "/rconServer.json";
		let serverCfg = {};

		if (fs.existsSync(serverCfgPath)) {
			serverCfg = require(serverCfgPath);
		}

		let oldName = msg.getContentArray()[3];
		let newName = msg.getContentArray()[5];

		if (serverCfg[oldName]) {
			serverCfg[newName] = serverCfg[oldName];
			delete serverCfg[oldName];

			let jsonString = JSON.stringify(serverCfg, null, 4);

			fs.writeFile(serverCfgPath, jsonString, "utf-8", function (err) {
				if (err) throw err;
				let censoredJson = jsonString.replace(/"rcon_password": "(.+)"/g, `"rcon_password": "********"`);
				msg.getChannel().send(`The server '${oldName}' has been renamed to '${newName}':` + "\n```json\n" + censoredJson + "```");
			});
		} else {
			msg.getChannel().send(`Sorry, but the config entry ${oldName}.${newName} does not exist.`);
		}
	}
};