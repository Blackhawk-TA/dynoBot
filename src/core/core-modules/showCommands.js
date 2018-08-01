const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const cmdPath = base + "/cfg/commands.json";

module.exports = {
	run: function (msg) {
		var commands = configHandler.readJSON(cmdPath, msg.guild.id);
		var answer = "List of regex commands:```";
		commands.forEach(function (command) {
			var rolesArray = command.permissions;
			var roles = "";
			rolesArray.forEach(function (role) {
				roles += role + ", "
			});
			roles = roles.slice(0, roles.length - 2);

			if (roles !== "") {
				roles = "(" + roles + ")"
			}

			var pathArray = command.path.split("/");
			var fileName = pathArray[pathArray.length - 1];
			var name = fileName.split(".")[0];
			answer += `\n${name} ${roles}: ${command.regex}`;
		});
		msg.channel.send(answer + "```");
	}
};