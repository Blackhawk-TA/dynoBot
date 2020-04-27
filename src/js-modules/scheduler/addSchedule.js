const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	run: function(msg, client, regexGroups) {
		let configPath = base + "/cfg/modules/scheduler.json",
			scheduleCfg = configHandler.readJSON(configPath, msg.getServer().getId()),
			scheduleName = regexGroups[1],
			scheduleDate = regexGroups[2];

		if (!scheduleCfg[scheduleName]) {
			let unixTime = Date.parse(scheduleDate) / 1000;
			if (unixTime) {
				scheduleCfg[scheduleName] = {
					unixTime: unixTime,
					date: scheduleDate,
					members: []
				};

				configHandler.overrideJSON(msg.getTextChannel(), configPath, scheduleCfg, false);
				console.log(`${new Date().toLocaleString()}: Added schedule '${scheduleName}' on ${msg.getServer().getId()}.`);
				msg.getTextChannel().send(`Added ${scheduleName} to the schedule.`);
			} else {
				msg.getTextChannel().send("Invalid date format. Try hh:mm UTC-X, yyyy-mm-dd.");
			}
		} else {
			msg.getTextChannel().send(`A schedule with the name '${scheduleName}' already exists.`);
		}
	}
};
