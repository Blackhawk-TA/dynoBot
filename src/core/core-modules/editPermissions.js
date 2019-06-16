const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const stringFormatter = require(base + "/src/utils/stringFormatter");
const cmdPath = base + "/cfg/commands.json";
const permissionsPath = base + "/cfg/permissions.json";

module.exports = {
	run: function(msg) {
		let commands = configHandler.readJSON(cmdPath, msg.getServer().getId(), "commandList");
		let cmdPermissions = configHandler.readJSON(permissionsPath, msg.getServer().getId());
		let serverRolesCollection = msg.getServer().getRoles();

		let requestedCmd = msg.getContentArray()[0];
		let bAddPermission = msg.getContentArray()[1] === "add";
		let requestedRole = msg.getContentArray()[4];

		let bRoleExists = false;
		let bRequestedCmdExists = false;
		let bRequestedCmdInPermissions = false;
		let bPermissionAlreadyInList = false;

		let i = 0;
		while (!bRoleExists && i < serverRolesCollection.length) {
			if (serverRolesCollection[i].name === requestedRole) {
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
				configHandler.overrideJSON(msg.channel, permissionsPath, cmdPermissions, false);
				msg.channel.send(`The role '${requestedRole}' has been added to the permissions list.\nAllowed roles: ${sAllowedRoles}`);
			} else if (!bAddPermission && bRequestedCmdInPermissions && bPermissionAlreadyInList) {
				let index = cmdPermissions[j].permissions.indexOf(requestedRole);
				cmdPermissions[j].permissions.splice(index, 1);

				aAllowedRoles = cmdPermissions[j].permissions;
				sAllowedRoles = aAllowedRoles.length === 0 ? "none" : "`" + stringFormatter.arrayToString(aAllowedRoles, ", ") + "`";
				configHandler.overrideJSON(msg.channel, permissionsPath, cmdPermissions, false);
				msg.channel.send(`The role '${requestedRole}' has been removed from the permissions list.\nAllowed roles: ${sAllowedRoles}`);
			} else if (bAddPermission && bPermissionAlreadyInList) {
				msg.channel.send(`The role '${requestedRole}' is already in the permissions list.`);
			} else if (!bAddPermission && !bRequestedCmdInPermissions || !bPermissionAlreadyInList) {
				msg.channel.send(`The role '${requestedRole}' does not exist in the permissions list.`);
			}
		} else if (!bRoleExists && !bRequestedCmdExists) {
			msg.channel.send(`The role '${requestedRole}' and the command '${requestedCmd}' both don't exist.`);
		} else if (!bRoleExists && bRequestedCmdExists) {
			msg.channel.send(`The role '${requestedRole}' doesn't exist.`);
		} else if (bRoleExists && !bRequestedCmdExists) {
			msg.channel.send(`The command '${requestedCmd}' doesn't exist.`);
		}
	}
};