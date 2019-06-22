const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	hasPermissions: function(msg, command) {
		let bPermission = true;

		if (msg.hasServer()) {
			let cmdPermissions = configHandler.readJSON(base + "/cfg/permissions.json", msg.getServer().getId());
			let bInPermissionsList = false;
			let authorRolesCollection = msg.getAuthorRoles();
			let authorRoles = [];

			authorRolesCollection.forEach(authorRole => {
				authorRoles.push(authorRole.getName());
			});

			cmdPermissions.forEach(function(cmdPermission) {
				let requiredRoles = cmdPermission.permissions;
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
		}

		return bPermission;
	}
};