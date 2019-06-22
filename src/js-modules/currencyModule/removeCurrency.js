const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/moduleConfigs/currencies.json";

module.exports = {
	run: function(msg) {
		let contentArray = msg.getContentArray(true),
			config = configHandler.readJSON(cfgPath, msg.getServer().getId()),
			currency = contentArray[contentArray.length - 1].toUpperCase();

		//Check if currency exists in file
		let index = -1;
		for (let i = 0; i < config.currencies.length; i++) {
			if (config.currencies[i] === currency) {
				index = i;
			}
		}

		if (index === -1) {
			msg.getChannel().send(currency + " does not exist in the currency list.");
		} else {
			config.currencies.splice(index, 1);
			configHandler.overrideJSON(msg.getChannel(), cfgPath, config);
		}
	}
};