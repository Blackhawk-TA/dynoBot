const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const cmdPath = base + "/cfg/commands.json";
const permissionsPath = base + "/cfg/permissions.json";

module.exports = {
	run: function (msg) {
		let serverId = msg.hasServer() ? msg.getServer().getId() : 0;
		let commands = configHandler.readJSON(cmdPath, serverId, "commandList");
		let cmdPermissions = configHandler.readJSON(permissionsPath, serverId);
		let answer = "List of regex commands:```";

		commands.forEach(function (command) {
			if (!command.hidden) {
				let roles = "";

				cmdPermissions.forEach(function(permission) {
					if (command.path === permission.path) {
						permission.permissions.forEach(function(role) {
							roles += role + ", ";
						});
					}
					roles = roles.slice(0, -2);
				});

				if (roles !== "") {
					roles = " (" + roles + ")";
				}

				let pathArray = command.path.split("/");
				let fileName = pathArray[pathArray.length - 1];
				let name = fileName.split(".")[0];
				answer += `\n${name}${roles}: ${command.regex}`;
			}
		});
		msg.getChannel().send(answer + "```");
	}
};