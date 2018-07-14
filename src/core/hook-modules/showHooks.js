const base = require("path").resolve(".");

const configPath =  base + "/cfg/hooks.json";
const hooks = require(configPath);
const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	run: function(msg) {
		var answer = "List of available hooks:```";
		for (var id in hooks) {
			var isEnabled = configHandler.readJSON(configPath, msg.channel.guild.id, id, "running");
			var active = isEnabled ? "active" : "inactive";
			answer += `\n${hooks[id].name}: (${active})`;
		}
		msg.channel.send(answer + "```");
	}
};