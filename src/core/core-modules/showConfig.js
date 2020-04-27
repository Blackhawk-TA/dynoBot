const fs = require("fs");
const base = require("path").resolve(".");

const configPath = base + "/cfg/config.json";
const config = require(configPath);

module.exports = {
	run: function(msg) {
		let answer = "This is the default config which is used as fallback:\n```json\n";
		answer += JSON.stringify(config, null, 4) + "```";

		let pathArray = configPath.split("/");
		let configName = pathArray[pathArray.length - 1];
		let serverId = msg.getTextChannel().getServer().getId();
		let pathServer = base + "/cfg/servers/" + serverId + "/";

		if (fs.existsSync(pathServer + configName)) {
			let customConfig = require(pathServer + configName);
			answer += "\n\nThis is the server specific config:\n```json\n" + JSON.stringify(customConfig, null, 4) + "```";
		}

		msg.getTextChannel().send(answer);
	}
};
