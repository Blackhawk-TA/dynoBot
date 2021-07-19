const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/modules/wakeOnLan.json";
const logger = require(base + "/src/utils/logger");

module.exports = {
	run: function(msg, client, aRegexGroups) {
		const bEnableNotification = aRegexGroups[1] === "enable";
		const sDeviceName = aRegexGroups[2].toLowerCase();
		const sNotificationState = bEnableNotification ? "enabled" : "disabled";

		configHandler.editJSON(msg.getTextChannel(), cfgPath, sDeviceName, "notifyAdmin", bEnableNotification, false);
		logger.info(`Set notification setting for '${sDeviceName}' to ${sNotificationState}.`);
	}
};
