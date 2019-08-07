const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	run: function(msg, client, regexGroups) {
		let configPath = base + "/cfg/moduleConfigs/scheduler.json",
			scheduleCfg = configHandler.readJSON(configPath, msg.getServer().getId()),
			mode = regexGroups[1],
			scheduleName = regexGroups[2],
			scheduleDate = regexGroups[3];

		if (mode === "add") {
			if (!scheduleCfg[scheduleName]) {
				let unixTime = Date.parse(scheduleDate) / 1000;
				if (unixTime) {
					scheduleCfg[scheduleName] = {
						unixTime: unixTime,
						date: scheduleDate,
						members: []
					};

					configHandler.overrideJSON(msg.getChannel(), configPath, scheduleCfg);
					console.log(`${new Date().toLocaleString()}: Added schedule '${scheduleName}' on ${msg.getServer().getId()}.`);
					msg.getChannel().send(`Added ${scheduleName} to the schedule.`);
				} else {
					msg.getChannel().send("Invalid date format. Try hh:mm UTC-X, YYYY-MM-dd.");
				}
			} else {
				msg.getChannel().send(`A schedule with the name '${scheduleName}' already exists.`);
			}
		} else if (mode === "remove") {
			if (scheduleCfg[scheduleName]) {
				delete scheduleCfg[scheduleName];

				configHandler.overrideJSON(msg.getChannel(), configPath, scheduleCfg);
				console.log(`${new Date().toLocaleString()}: Removed schedule '${scheduleName}' on ${msg.getServer().getId()}.`);
				msg.getChannel().send(`Removed ${scheduleName} to the schedule.`);
			} else {
				msg.getChannel().send(`A schedule with the name '${scheduleName}' does not exist.`);
			}
		}
	}
};