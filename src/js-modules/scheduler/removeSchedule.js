const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	run: function(msg, client, regexGroups) {
		let configPath = base + "/cfg/modules/scheduler.json",
			scheduleCfg = configHandler.readJSON(configPath, msg.getServer().getId()),
			scheduleName = regexGroups[1];

		if (scheduleCfg[scheduleName]) {
			delete scheduleCfg[scheduleName];

			configHandler.overrideJSON(msg.getChannel(), configPath, scheduleCfg, false);
			console.log(`${new Date().toLocaleString()}: Removed schedule '${scheduleName}' on ${msg.getServer().getId()}.`);
			msg.getChannel().send(`Removed ${scheduleName} from the schedule.`);
		} else {
			msg.getChannel().send(`A schedule with the name '${scheduleName}' does not exist.`);
		}
	}
};
