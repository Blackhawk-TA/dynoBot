const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/modules/wakeOnLan.json";
const MAX_MESSAGE_LENGTH = 2000;

module.exports = {
	run: function(msg) {
		const oDeviceConfig = configHandler.readJSON(cfgPath, msg.getServer().getId());
		let sAnswerPrefix = "Device list:```",
			sAnswerSuffix = "```",
			sAnswer = sAnswerPrefix,
			sAnswerLine = "";

		for (let sKey in oDeviceConfig) {
			if (oDeviceConfig.hasOwnProperty(sKey)) {
				sAnswerLine = `\n${sKey} - Notify admin: '${oDeviceConfig[sKey].notifyAdmin}', IP: '${oDeviceConfig[sKey].ip}'`;
			}

			if (sAnswer.length + sAnswerLine.length + sAnswerSuffix.length < MAX_MESSAGE_LENGTH) {
				sAnswer += sAnswerLine;
			} else {
				sAnswer += sAnswerSuffix;
				msg.getTextChannel().send(sAnswer);
				sAnswer = "```" + sAnswerLine;
			}
		}

		if (sAnswer === sAnswerPrefix) {
			sAnswer = "No devices entered.";
		} else {
			sAnswer += sAnswerSuffix;
		}

		msg.getTextChannel().send(sAnswer);
	}
};
