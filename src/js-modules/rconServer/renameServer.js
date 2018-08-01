const fs = require("fs");

const base = require("path").resolve(".");

module.exports = {
	run: function (msg) {
		var serverCfgPath = base + "/cfg/servers/" + msg.guild.id + "/rconServer.json";
		var serverCfg = {};

		if (fs.existsSync(serverCfgPath)) {
			serverCfg = require(serverCfgPath);
		}

		var oldName = msg.contentArray[2];
		var newName = msg.contentArray[4];

		if (serverCfg[oldName]) {
			serverCfg[newName] = serverCfg[oldName];
			delete serverCfg[oldName];

			var jsonString = JSON.stringify(serverCfg, null, 4);

			fs.writeFile(serverCfgPath, jsonString, "utf-8", function (err) {
				if (err) throw err;
				var censoredJson = jsonString.replace(/"rcon_password": "(.+)"/g, `"rcon_password": "********"`);
				msg.channel.send(`The server '${oldName}' has been renamed to '${newName}':` + "\n```json\n" + censoredJson + "```");
			});
		} else {
			msg.channel.send(`Sorry, but the config entry ${oldName}.${newName} does not exist.`);
		}
	}
};