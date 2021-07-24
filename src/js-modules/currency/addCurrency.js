const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/modules/currencies.json";
const logger = require(base + "/src/utils/logger");
const fetch = require("node-fetch");

module.exports = {
	run: function (msg) {
		let contentArray = msg.getContentArray(true),
			config = configHandler.readJSON(cfgPath, msg.getServer().getId()),
			currency = contentArray[contentArray.length - 1].toUpperCase();

		fetch("https://min-api.cryptocompare.com/data/price?fsym=" + currency + "&tsyms=EUR,USD")
			.then(response => response.json())
			.then(data => {
				if (data.EUR === undefined) {
					msg.getTextChannel().send(currency + " does not exist.");
				} else {
					//Currency exists and can be added
					let alreadyExists = false;
					for (let i = 0; i < config.currencies.length; i++) {
						if (config.currencies[i] === currency) {
							alreadyExists = true;
						}
					}

					if (alreadyExists) {
						msg.getTextChannel().send(currency + " already exists in the currency list.");
					} else {
						config.currencies.push(currency);
						configHandler.overrideJSON(msg.getTextChannel(), cfgPath, config);
					}
				}
			})
			.catch(error => {
				msg.getTextChannel().send("Could not request currencies, please try again later");
				logger.error(`Could not request currencies:\n${error}`);
			});
	}
};
