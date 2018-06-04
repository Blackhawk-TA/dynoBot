const configHandler = require("./../configHandler");

module.exports = {
	run: function(msg) {
		var hookConfig = configHandler.readJSON("hooks", msg.guild.id);
		msg.channel.send("```json\n" + JSON.stringify(hookConfig, null, 4) + "```");
	}
};