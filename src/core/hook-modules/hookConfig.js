const hookJson = require("./../../../cfg/hooks.json");

module.exports = {
	run: function(msg) {
		msg.channel.send("```json\n" + JSON.stringify(hookJson, null, 4) + "```");
	}
};