const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	run: function(msg, client, regexGroups) {
		let configPath = base + "/cfg/modules/scheduler.json",
			scheduleCfg = configHandler.readJSON(configPath, msg.getServer().getId()),
			changeType = regexGroups[1],
			scheduleName = regexGroups[2],
			newValue = regexGroups[3],
			configModified = false;

		if (scheduleCfg[scheduleName]) {
			if (changeType === "name") {
				scheduleCfg[newValue] = scheduleCfg[scheduleName];
				delete scheduleCfg[scheduleName];
				configModified = true;
			} else if (changeType === "date") {
				let unixTime = Date.parse(newValue) / 1000;
				if (unixTime) {
					scheduleCfg[scheduleName].unixTime = unixTime;
					scheduleCfg[scheduleName].date = newValue;
					configModified = true;
				} else {
					msg.getTextChannel().send("Invalid date format. Try hh:mm UTC-X, yyyy-mm-dd.");
				}
			}

			if (configModified) {
				configHandler.overrideJSON(msg.getTextChannel(), configPath, scheduleCfg, false);
				console.log(`${new Date().toLocaleString()}: Changed schedule '${changeType}' on ${msg.getServer().getId()}.`);
				msg.getTextChannel().send(`Changed ${changeType} of ${scheduleName} to ${newValue}.`);
			}
		} else {
			msg.getTextChannel().send(`A schedule with the name '${scheduleName}' does not exist.`);
		}
	}
};
