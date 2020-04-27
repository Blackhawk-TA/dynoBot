const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	run: function(msg, client, regexGroups) {
		let configPath = base + "/cfg/modules/scheduler.json",
			scheduleCfg = configHandler.readJSON(configPath, msg.getServer().getId()),
			scheduleName = regexGroups[1],
			formattedSchedule = "";

		if (scheduleName) {
			formattedSchedule = this.formatSchedule(scheduleCfg, scheduleName);
		} else {
			for (let schedule in scheduleCfg) {
				if (scheduleCfg.hasOwnProperty(schedule)) {
					formattedSchedule += this.formatSchedule(scheduleCfg, schedule) + "\n\n";
				}
			}
		}

		if (formattedSchedule) {
			msg.getTextChannel().send(formattedSchedule);
		} else if (scheduleName) {
			msg.getTextChannel().send("There was a problem fetching the schedule. Check if the requested schedule name is correct.");
		} else {
			msg.getTextChannel().send("There are no schedules.");
		}
	},

	formatSchedule(scheduleCfg, scheduleName) {
		if (scheduleName) {
			let schedule = scheduleCfg[scheduleName];
			if (schedule) {
				let memberList = "",
					members = schedule.members;

				members.forEach(member => {
					memberList += "<@" + member + "> ";
				});
				return `**${scheduleName}** *- (${schedule.date})*\nMembers: ${memberList}`;
			} else {
				return null;
			}
		}
	}
};
