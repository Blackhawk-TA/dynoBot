const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const cmdPath = base + "/cfg/commands.json";
const permissionsPath = base + "/cfg/permissions.json";
const MAX_MESSAGE_LENGTH = 2000;

module.exports = {
	run: function (msg, client, regexGroups) {
		let serverId = msg.hasServer() ? msg.getServer().getId() : 0,
			commands = configHandler.readJSON(cmdPath, serverId, "commandList"),
			cmdPermissions = configHandler.readJSON(permissionsPath, serverId),
			answer = "Command list:```";

		commands.forEach(function (command) {
			if (!command.hidden) {
				let roles = "";

				if (regexGroups[1]) {
					let firstSpaceIndex = regexGroups[1].indexOf(" "),
						commandGroup = regexGroups[1].substring(firstSpaceIndex).trim();

					if (commandGroup && commandGroup !== command.group) {
						return; //Skip command if it's not of the required group
					}
				}

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

				let pathArray = command.path.split("/"),
					fileName = pathArray[pathArray.length - 1],
					name = fileName.split(".")[0],
					commandHelp = command.help ? command.help : command.regex,
					groupIdentifier = "[no group] ",
					answerLine;

				if (command.group) {
					groupIdentifier = "[" + command.group + "] ";
				}

				answerLine = `\n${groupIdentifier}${name}${roles}: ${commandHelp}`;

				if (answer.length + answerLine.length < MAX_MESSAGE_LENGTH) {
					answer += answerLine;
				} else {
					answer += "```";
					msg.getTextChannel().send(answer);
					answer = "```" + answerLine;
				}
			}
		});

		if (answer === "") {
			answer = "No commands found.";
		}

		msg.getTextChannel().send(answer + "```");
	}
};
