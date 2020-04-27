const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const stringFormatter = require(base + "/src/utils/stringFormatter");
const cmdPath = base + "/cfg/commands.json";
const permissionsPath = base + "/cfg/permissions.json";

module.exports = {
	run: function(msg) {
		let commands = configHandler.readJSON(cmdPath, msg.getServer().getId(), "commandList"),
			cmdPermissions = configHandler.readJSON(permissionsPath, msg.getServer().getId()),
			serverRoles = msg.getServer().getRoles();

		let contentArray = msg.getContentArray(true),
			requestedCmd = contentArray[0],
			bAddPermission = contentArray[1] === "add",
			requestedRole = contentArray[4];

		let bRoleExists = false,
			bRequestedCmdExists = false,
			bRequestedCmdInPermissions = false,
			bPermissionAlreadyInList = false;

		let i = 0;
		while (!bRoleExists && i < serverRoles.length) {
			if (serverRoles[i].getName() === requestedRole) {
				bRoleExists = true;
			} else {
				i++;
			}
		}

		let k = 0;
		while (!bRequestedCmdExists && k < commands.length) {
			let pathArray = commands[k].path.split("/");
			let fileName = pathArray[pathArray.length - 1];
			let cmdName = fileName.split(".")[0];

			if (cmdName === requestedCmd) {
				bRequestedCmdExists = true;
			} else {
				k++;
			}
		}

		let j = 0;
		while (bRoleExists && bRequestedCmdExists && !bRequestedCmdInPermissions && j < cmdPermissions.length) {
			commands.forEach(function(command) {
				if (command.path === cmdPermissions[j].path) {
					bRequestedCmdInPermissions = true;
					if (cmdPermissions[j].permissions.includes(requestedRole)) {
						bPermissionAlreadyInList = true;
					}
				}
			});

			if (!bRequestedCmdExists) {
				j++;
			}
		}

		if (bRoleExists && bRequestedCmdExists) {
			let aAllowedRoles;
			let sAllowedRoles;

			if (bAddPermission && !bPermissionAlreadyInList) {
				if (bRequestedCmdInPermissions) {
					cmdPermissions[j].permissions.push(requestedRole);
				} else {
					cmdPermissions.push({
						"permissions": [requestedRole],
						"path": commands[k].path
					});
				}

				aAllowedRoles = cmdPermissions[j].permissions;
				sAllowedRoles = aAllowedRoles.length === 0 ? "none" : "`" + stringFormatter.arrayToString(aAllowedRoles, ", ") + "`";
				configHandler.overrideJSON(msg.getTextChannel(), permissionsPath, cmdPermissions, false);
				msg.getTextChannel().send(`The role '${requestedRole}' has been added to the permissions list.\nAllowed roles: ${sAllowedRoles}`);
			} else if (!bAddPermission && bRequestedCmdInPermissions && bPermissionAlreadyInList) {
				let index = cmdPermissions[j].permissions.indexOf(requestedRole);
				cmdPermissions[j].permissions.splice(index, 1);

				aAllowedRoles = cmdPermissions[j].permissions;
				sAllowedRoles = aAllowedRoles.length === 0 ? "none" : "`" + stringFormatter.arrayToString(aAllowedRoles, ", ") + "`";
				configHandler.overrideJSON(msg.getTextChannel(), permissionsPath, cmdPermissions, false);
				msg.getTextChannel().send(`The role '${requestedRole}' has been removed from the permissions list.\nAllowed roles: ${sAllowedRoles}`);
			} else if (bAddPermission && bPermissionAlreadyInList) {
				msg.getTextChannel().send(`The role '${requestedRole}' is already in the permissions list.`);
			} else if (!bAddPermission && !bRequestedCmdInPermissions || !bPermissionAlreadyInList) {
				msg.getTextChannel().send(`The role '${requestedRole}' does not exist in the permissions list.`);
			}
		} else if (!bRoleExists && !bRequestedCmdExists) {
			msg.getTextChannel().send(`The role '${requestedRole}' and the command '${requestedCmd}' both don't exist.`);
		} else if (!bRoleExists && bRequestedCmdExists) {
			msg.getTextChannel().send(`The role '${requestedRole}' doesn't exist.`);
		} else if (bRoleExists && !bRequestedCmdExists) {
			msg.getTextChannel().send(`The command '${requestedCmd}' doesn't exist.`);
		}
	}
};
