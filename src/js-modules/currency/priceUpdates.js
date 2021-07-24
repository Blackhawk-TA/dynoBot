const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const logger = require(base + "/src/utils/logger");
const fetch = require("node-fetch");

let loopIndex = 0;
let answerDefault = "Current market situation:```js\n";
let answer = answerDefault;

module.exports = {
	pushUpdate: function(channel, currency, config) {
		let self = this;

		fetch("https://min-api.cryptocompare.com/data/price?fsym=" + currency + "&tsyms=EUR,USD")
			.then(response => response.json())
			.then(data => {
				answer += "\n1 " + currency + " equals " + data.EUR + "€ or " + data.USD + "$.";

				loopIndex++;
				if (config.currencies.length > loopIndex) {
					self.pushUpdate(channel, config.currencies[loopIndex], config);
				} else {
					loopIndex = 0;
					channel.send(answer + "```");
					answer = answerDefault;
				}
			})
			.catch(error => {
				logger.error(`Could not request currency prices:\n${error}`);
			});
	},

	run: function(msg) {
		let config = configHandler.readJSON(base + "/cfg/modules/currencies.json", msg.getServer().getId());
		module.exports.pushUpdate(msg.getTextChannel(), config.currencies[loopIndex], config);
	},

	hook: function(channel) {
		let config = configHandler.readJSON(base + "/cfg/modules/currencies.json", channel.getServer().getId());
		module.exports.pushUpdate(channel, config.currencies[loopIndex], config);
	}
};
