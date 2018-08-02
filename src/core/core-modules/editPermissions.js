const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const cmdPath = base + "/cfg/commands.json";

module.exports = {
	run: function (msg) {
		var commands = configHandler.readJSON(cmdPath, msg.guild.id);
		var serverRolesCollection = msg.guild.roles.array();

		var requestedCmd = msg.contentArray[0];
		var bAddPermission = msg.contentArray[1] === "add";
		var requestedRole = msg.contentArray[4];
		var bRoleExists = false;
		var bRequestedCmdExists = false;

		var i = 0;
		while (!bRoleExists && i < serverRolesCollection.length) {
			if (serverRolesCollection[i].name === requestedRole) {
				bRoleExists = true;
			} else {
				i++;
			}
		}

		var k = 0;
		while (!bRequestedCmdExists && k < commands.length) {
			var pathArray = commands[k].path.split("/");
			var fileName = pathArray[pathArray.length - 1];
			var cmdName = fileName.split(".")[0];

			if (cmdName === requestedCmd) {
				if (commands[k].permissions.includes(requestedRole)) {
					if (bAddPermission) {
						msg.channel.send(`The role '${requestedRole}' is already in the permissions list.`);
					} else {
						var index = commands[k].permissions.indexOf(requestedRole);
						commands[k].permissions.splice(index);
						configHandler.overrideJSON(msg.channel, cmdPath, commands, false);
						msg.channel.send(`The role '${requestedRole}' has been removed from the permissions list.`);
					}
				} else if (bRoleExists) {
					if (bAddPermission) {
						commands[k].permissions.push(requestedRole);
						configHandler.overrideJSON(msg.channel, cmdPath, commands, false);
						msg.channel.send(`The role '${requestedRole}' has been added to the permissions list.`);
					} else {
						msg.channel.send(`The role '${requestedRole}' is not in the permissions list.`);
					}
				}
				bRequestedCmdExists = true;
			} else {
				k++;
			}
		}

		if (!bRoleExists && !bRequestedCmdExists) {
			msg.channel.send(`The role '${requestedRole}' and the command '${requestedCmd}' both don't exist.`);
		} else if (!bRoleExists && bRequestedCmdExists) {
			msg.channel.send(`The role '${requestedRole}' doesn't exist.`);
		} else if (bRoleExists && !bRequestedCmdExists) {
			msg.channel.send(`The command '${requestedCmd}' doesn't exist.`);
		}
	}
};