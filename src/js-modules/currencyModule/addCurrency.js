const request = require("request");

const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/moduleConfigs/currencies.json";

module.exports = {
	run: function (msg) {
		var config = configHandler.readJSON(cfgPath, msg.guild.id);
		var currency = msg.contentArray[msg.contentArray.length - 1].toUpperCase();

		request("https://min-api.cryptocompare.com/data/price?fsym=" + currency + "&tsyms=EUR,USD", function (error, response, body) {
			if (!error && response.statusCode === 200) {
				var data = JSON.parse(body);
				if (data.EUR === undefined) {
					msg.channel.send(currency + " does not exist.");
				} else {
					//Currency exists and can be added
					var alreadyExists = false;
					for (var i = 0; i < config.currencies.length; i++) {
						if (config.currencies[i] === currency) {
							alreadyExists = true;
						}
					}

					if (alreadyExists) {
						msg.channel.send(currency + " already exists in the currency list.");
					} else {
						config.currencies.push(currency);
						configHandler.overrideJSON(msg.channel, cfgPath, config);
					}
				}
			} else {
				msg.channel.send("There was an timeout at the API request, please try again later.");
			}
		});
	}
};