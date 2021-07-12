const fs = require("fs");
const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/modules/wakeOnLan.json";

module.exports = {
	run: function(msg, client, aRegexGroups) {
		const sName = aRegexGroups[1];
		const sIP = aRegexGroups[2];
		const sMAC = aRegexGroups[6];
		const sAdmin = msg.getAuthor().getTag();

		let wakeOnLanCfgPath = base + "/cfg/servers/" + msg.getServer().getId() + "/wakeOnLan.json";
		let wakeOnLanCfg = {};

		if (fs.existsSync(wakeOnLanCfgPath)) {
			wakeOnLanCfg = require(wakeOnLanCfgPath);
		}

		if (!wakeOnLanCfg[sName]) {
			wakeOnLanCfg[sName] = {
				ip: sIP,
				mac: sMAC,
				admin: sAdmin,
				notifyAdmin: true
			};

			configHandler.overrideJSON(msg.getTextChannel(), cfgPath, wakeOnLanCfg, false);
			msg.getTextChannel().send(`Added wake-on-lan device '${sName}' with admin '${sAdmin}'.\nA notification to the admin will be sent when a wake signal is sent. This can be disabled optionally.`);
		} else {
			msg.getTextChannel().send(`A wake-on-lan device with the name ${sName} already exists.`);
		}
	}
};
