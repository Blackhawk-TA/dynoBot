const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	run: function(msg) {
		let pathConfig = base + "/cfg/hooks.json";
		let hookConfig = configHandler.readJSON(pathConfig, msg.getServer().getId());
		msg.getTextChannel().send("```json\n" + JSON.stringify(hookConfig, null, 4) + "```");
	}
};
