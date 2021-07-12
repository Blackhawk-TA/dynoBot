const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/modules/wakeOnLan.json";
const logger = require(base + "/src/utils/logger");
const wol = require("wake_on_lan");

module.exports = {
	run: function(msg, client, aRegexGroups) {
		const sDeviceName = aRegexGroups[1];
		const oDeviceConfig = configHandler.readJSON(cfgPath, msg.getServer().getId(), sDeviceName);

		if (oDeviceConfig.ip && oDeviceConfig.mac) {
			wol.wake(oDeviceConfig.mac, {address: oDeviceConfig.ip}, function(error) {
				if (error) {
					logger.error(`Could not send wake signal to IP: '${oDeviceConfig.ip}', MAC: '${oDeviceConfig.mac}': `, error);
					msg.getTextChannel().send(`Could not sent wake signal to '${sDeviceName}'.`);
				} else {
					logger.info(`Successfully sent wake signal to IP: '${oDeviceConfig.ip}', MAC: '${oDeviceConfig.mac}'`);
					msg.getTextChannel().send(`Successfully sent wake signal to '${sDeviceName}'.`);

					if (oDeviceConfig.notifyAdmin) {
						let oAdmin;
						let i = 0;
						let aMembers = msg.getServer().getMembers(); //TODO does not return all members?
						while (!oAdmin && i < aMembers.length) {
							if (aMembers[i].getTag() === oDeviceConfig.admin) {
								oAdmin = aMembers[i];
							}
							i++;
						}

						if (oAdmin) {
							oAdmin.createDM().then(oDM => {
								oDM.send(`A wake signal to your device '${sDeviceName}' with IP '${oDeviceConfig.ip}' and MAC '${oDeviceConfig.mac}' was sent.`);
								logger.info(`Notified admin '${oDeviceConfig.admin}' that a wake signal was sent to ${sDeviceName}.`);
							}).catch(error => {
								logger.error(`Could not notify admin '${oDeviceConfig.admin}' that a wake signal was sent to ${sDeviceName}: ${error}`);
							});
						} else {
							msg.getTextChannel().send(`Invalid admin tag. Notification to '${oDeviceConfig.admin}' could not be sent.`);
							logger.info(`Invalid admin. Could not notify admin '${oDeviceConfig.admin}' that a wake signal was sent to ${sDeviceName}.`);
						}
					}
				}
			});
		} else {
			msg.getTextChannel().send(`Could not find ip and mac address for device '${sDeviceName}'.`);
			logger.info(`Could not find ip and mac address for device '${sDeviceName}'.`);
		}
	}
};
