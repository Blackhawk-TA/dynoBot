const base = require("path").resolve(".");

const commands = require(base + "/cfg/commands.json");

module.exports = {
	run: function(msg) {
		msg.channel.send("```json\n" + JSON.stringify(commands, null, 4) + "```");
	}
};