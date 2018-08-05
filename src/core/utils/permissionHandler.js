const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	hasPermissions: function(msg, command) {
		var cmdPermissions = configHandler.readJSON(base + "/cfg/permissions.json", msg.guild.id);
		var bPermission = true;
		var bInPermissionsList = false;
		var authorRolesCollection = msg.member.roles.array();
		var authorRoles = [];

		for (var k = 0 in authorRolesCollection) {
			authorRoles.push(authorRolesCollection[k].name);
		}

		cmdPermissions.forEach(function(cmdPermission) {
			var requiredRoles = cmdPermission.permissions;
			if (cmdPermission.path === command.path && requiredRoles.length > 0) {
				authorRoles.forEach(function(authorRole) {
					requiredRoles.forEach(function(requiredRole) {
						if (authorRole === requiredRole) {
							bInPermissionsList = true;
						}
					});
				});
				bPermission = bInPermissionsList;
			}
		});

		return bPermission;
	}
};