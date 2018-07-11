const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/moduleConfigs/currencies.json";

module.exports = {
	run: function(msg) {
		var config = configHandler.readJSON(cfgPath, msg.guild.id);
		var currency = msg.contentArray[msg.contentArray.length - 1].toUpperCase();

		//Check if currency exists in file
		var index = -1;
		for (var i = 0; i < config.currencies.length; i++) {
			if (config.currencies[i] === currency) {
				index = i;
			}
		}

		if (index === -1) {
			msg.channel.send(currency + " does not exist in the currency list.");
		} else {
			config.currencies.splice(index, 1);
			configHandler.overrideJSON(msg.channel, cfgPath, config);
		}
	}
};