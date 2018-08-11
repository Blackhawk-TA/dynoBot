const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const cmdPath = base + "/cfg/commands.json";
const permissionsPath = base + "/cfg/permissions.json";

module.exports = {
	run: function (msg) {
		var commands = configHandler.readJSON(cmdPath, msg.guild.id, "commandList");
		var cmdPermissions = configHandler.readJSON(permissionsPath, msg.guild.id);
		var answer = "List of regex commands:```";

		commands.forEach(function (command) {
			var roles = "";

			cmdPermissions.forEach(function (permission) {
				if (command.path === permission.path) {
					permission.permissions.forEach(function (role) {
						roles += role + ", ";
					});
				}
				roles = roles.slice(0, -2);
			});

			if (roles !== "") {
				roles = " (" + roles + ")"
			}

			var pathArray = command.path.split("/");
			var fileName = pathArray[pathArray.length - 1];
			var name = fileName.split(".")[0];
			answer += `\n${name}${roles}: ${command.regex}`;
		});
		msg.channel.send(answer + "```");
	}
};