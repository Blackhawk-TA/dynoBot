const fs = require("fs");
const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/modules/wakeOnLan.json";
const logger = require(base + "/src/utils/logger");

module.exports = {
	run: function(msg, client, aRegexGroups) {
		const sName = aRegexGroups[1].toLowerCase();
		const sIP = aRegexGroups[2];
		const sAdmin = msg.getAuthor().getId();
		const rMacAddressRegex = /^([a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5})$/;

		let sWakeOnLanCfgPath = base + "/cfg/servers/" + msg.getServer().getId() + "/wakeOnLan.json";
		let oWakeOnLanCfg = {};

		if (fs.existsSync(sWakeOnLanCfgPath)) {
			oWakeOnLanCfg = require(sWakeOnLanCfgPath);
		}

		if (!oWakeOnLanCfg[sName]) {
			msg.getTextChannel().send("Please enter the MAC-Address of your device within the next 60 seconds in a private message.");

			let user = msg.getAuthor();
			user.createDM().then(pm => {
				pm.send(`Hello ${user.getName()}, you requested to add a new wake-on-lan device on the server '${msg.getServer().getName()}'.`
					+ "Please enter the MAC-Address of the device in the chat.");

				pm.awaitMessages({max: 2, time: 60000, errors: ["time"]}).then(messages => {
					let sMacAddress = messages[1].getContent();
					if (sMacAddress && messages[1].getAuthor().getId() === user.getId()) {
						if (sMacAddress.match(rMacAddressRegex)) {
							oWakeOnLanCfg[sName] = {
								ip: sIP,
								mac: sMacAddress,
								admin: sAdmin,
								notifyAdmin: true
							};

							configHandler.overrideJSON(msg.getTextChannel(), cfgPath, oWakeOnLanCfg, false);
							pm.send("Set MAC-Address successfully.");
							msg.getTextChannel().send(`Added wake-on-lan device '${sName}' with you as an admin'.`
								+ "\nA notification to the admin will be sent when a wake signal is sent. This can be disabled optionally.");
						} else {
							pm.send("Invalid MAC-Address, please add the device again.");
							msg.getTextChannel().send("Invalid MAC-Address, please add the device.");
						}
					} else {
						pm.send("Could not set MAC-Address, please add the device again.");
						msg.getTextChannel().send("Could not set MAC-Address, please add the device again.");
					}
				}).catch(error => {
					logger.warn("Could not fetch messages:\n", error);
					pm.send("The time for entering the MAC-Address has passed. Please add the device again.");
					msg.getTextChannel().send("The time for entering the MAC-Address has passed. Please add the device again.");
				});
			}).catch(error => {
				msg.getTextChannel().send("Could not create a direct message to set the MAC-Address of your device.");
				logger.error(`Could not create direct message to '${user.getName()}' for setting the MAC-Address on the server '${msg.getServer().getId()}':\n${error}`);
			});


		} else {
			msg.getTextChannel().send(`A wake-on-lan device with the name '${sName}' already exists.`);
		}
	}
};
