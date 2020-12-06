const base = require("path").resolve(".");
const logger = require(base + "/src/utils/logger");
const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	run: function(msg, client, regexGroups) {
		let configPath = base + "/cfg/modules/scheduler.json",
			scheduleCfg = configHandler.readJSON(configPath, msg.getServer().getId()),
			scheduleName = regexGroups[1];

		if (scheduleCfg[scheduleName]) {
			delete scheduleCfg[scheduleName];

			configHandler.overrideJSON(msg.getTextChannel(), configPath, scheduleCfg, false);
			logger.info(`Removed schedule '${scheduleName}' on ${msg.getServer().getId()}.`);
			msg.getTextChannel().send(`Removed ${scheduleName} from the schedule.`);
		} else {
			msg.getTextChannel().send(`A schedule with the name '${scheduleName}' does not exist.`);
		}
	}
};
