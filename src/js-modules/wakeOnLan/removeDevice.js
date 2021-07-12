const fs = require("fs");
const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/modules/wakeOnLan.json";

module.exports = {
	run: function(msg, client, aRegexGroups) {
		const sDeviceName = aRegexGroups[2];
		const oDeviceConfig = configHandler.readJSON(cfgPath, msg.getServer().getId());

		if (oDeviceConfig[sDeviceName]) {
			delete oDeviceConfig[sDeviceName];

			let wakeOnLanCfgPath = base + "/cfg/servers/" + msg.getServer().getId() + "/wakeOnLan.json";
			let wakeOnLanCfg = {};

			if (fs.existsSync(wakeOnLanCfgPath)) {
				wakeOnLanCfg = require(wakeOnLanCfgPath);
				configHandler.overrideJSON(msg.getTextChannel(), cfgPath, wakeOnLanCfg, false);
				msg.getTextChannel().send(`Deleted device '${sDeviceName}'.`);
			} else {
				msg.getTextChannel().send("There are no devices set that can be deleted.");
			}

		} else {
			msg.getTextChannel().send(`Could not find device '${sDeviceName}'.`);
		}
	}
};
