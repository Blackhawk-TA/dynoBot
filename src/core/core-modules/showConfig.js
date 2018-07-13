const fs = require("fs");
const base = require("path").resolve(".");

const configPath =  base + "/cfg/config.json";
const config = require(configPath);

module.exports = {
	run: function(msg) {
		var answer = "This is the default config which is used as fallback:\n```json\n";
		answer += JSON.stringify(config, null, 4) + "```";

		var pathArray = configPath.split("/");
		var configName = pathArray[pathArray.length - 1];
		var guildId = msg.channel.guild.id;
		var pathServer = base + "/cfg/servers/" + guildId + "/";

		if (fs.existsSync(pathServer + configName)) {
			var customConfig = require(pathServer + configName);
			answer += "\n\nThis is the server specific config:\n```json\n" + JSON.stringify(customConfig, null, 4) + "```";
		}

		msg.channel.send(answer);
	}
};
