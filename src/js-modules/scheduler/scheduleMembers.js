const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	run: function(msg, client, regexGroups) {
		let configPath = base + "/cfg/modules/scheduler.json",
			scheduleCfg = configHandler.readJSON(configPath, msg.getServer().getId()),
			mode = regexGroups[1],
			scheduleName = regexGroups[2];

		if (scheduleCfg[scheduleName]) {
			let authorId = msg.getAuthor().getId(),
				scheduleMembers = scheduleCfg[scheduleName].members;

			if (mode === "join") {
				if (!scheduleMembers.includes(authorId)) {
					scheduleMembers.push(authorId);

					console.log(`${new Date().toLocaleString()}: Added member '${authorId}' to '${scheduleName}' on '${msg.getServer().getId()}'.`);
					configHandler.editJSON(msg.getTextChannel(), configPath, scheduleName, "members", scheduleMembers, false);
				} else {
					msg.getTextChannel().send(`<@${authorId}> is already a member of this schedule.`);
				}
			} else if (mode === "leave") {
				if (scheduleMembers.includes(authorId)) {
					scheduleMembers.splice(scheduleMembers.indexOf(authorId), 1);

					console.log(`${new Date().toLocaleString()}: Removed member '${authorId}' to '${scheduleName}' on '${msg.getServer().getId()}'.`);
					configHandler.editJSON(msg.getTextChannel(), configPath, scheduleName, "members", scheduleMembers, false);
				} else {
					msg.getTextChannel().send(`<@${authorId}> is not a member of this schedule.`);
				}
			}
		} else {
			msg.getTextChannel().send(`There is no schedule called '${scheduleName}'.`);
		}
	}
};
