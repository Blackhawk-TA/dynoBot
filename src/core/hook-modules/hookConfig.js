const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	run: function(msg) {
		var pathConfig = base + "/cfg/hooks.json";
		var hookConfig = configHandler.readJSON(pathConfig, msg.guild.id);
		msg.channel.send("```json\n" + JSON.stringify(hookConfig, null, 4) + "```");
	}
};