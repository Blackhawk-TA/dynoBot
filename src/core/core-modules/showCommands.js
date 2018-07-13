const base = require("path").resolve(".");

const commands = require(base + "/cfg/commands.json");

module.exports = {
	run: function(msg) {
		var answer = "List of regex commands:```";
		commands.forEach(function(command) {
			var pathArray = command.path.split("/");
			var fileName = pathArray[pathArray.length - 1];
			var name = fileName.split(".")[0];
			answer += `\n${name}: ${command.regex}`;
		});
		msg.channel.send(answer + "```");
	}
};