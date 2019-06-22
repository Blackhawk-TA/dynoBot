const request = require("request");

const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/moduleConfigs/currencies.json";

module.exports = {
	run: function (msg) {
		let contentArray = msg.getContentArray(true),
			config = configHandler.readJSON(cfgPath, msg.getServer().getId()),
			currency = contentArray[contentArray.length - 1].toUpperCase();

		request("https://min-api.cryptocompare.com/data/price?fsym=" + currency + "&tsyms=EUR,USD", function (error, response, body) {
			if (!error && response.statusCode === 200) {
				let data = JSON.parse(body);
				if (data.EUR === undefined) {
					msg.getChannel().send(currency + " does not exist.");
				} else {
					//Currency exists and can be added
					let alreadyExists = false;
					for (let i = 0; i < config.currencies.length; i++) {
						if (config.currencies[i] === currency) {
							alreadyExists = true;
						}
					}

					if (alreadyExists) {
						msg.getChannel().send(currency + " already exists in the currency list.");
					} else {
						config.currencies.push(currency);
						configHandler.overrideJSON(msg.getChannel(), cfgPath, config);
					}
				}
			} else {
				msg.getChannel().send("There was an timeout at the API request, please try again later.");
			}
		});
	}
};