const base = require("path").resolve(".");

const configPath =  base + "/cfg/hooks.json";
const hooks = require(configPath);
const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	run: function(msg) {
		let answer = "List of available hooks:```";
		for (let id in hooks) {
			if (hooks.hasOwnProperty(id)) {
				let isEnabled = configHandler.readJSON(configPath, msg.getChannel().getServer().getId(), id, "running");
				let active = isEnabled ? "active" : "inactive";
				answer += `\n${hooks[id].name}: (${active})`;
			}
		}
		msg.getChannel().send(answer + "```");
	}
};