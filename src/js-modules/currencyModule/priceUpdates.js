const request = require("request");

const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");

let loopIndex = 0;
let answerDefault = "Current market situation:```js\n";
let answer = answerDefault;

module.exports = {
	pushUpdate: function(channel, currency, config) {
		let self = this;

		request("https://min-api.cryptocompare.com/data/price?fsym=" + currency + "&tsyms=EUR,USD", function (error, response, body) {
			if (!error && response.statusCode === 200) {
				let data = JSON.parse(body);
				answer += "\n1 " + currency + " equals " + data.EUR + "€ or " + data.USD + "$.";

				loopIndex++;
				if (config.currencies.length > loopIndex) {
					self.pushUpdate(channel, config.currencies[loopIndex], config);
				} else {
					loopIndex = 0;
					channel.send(answer + "```");
					answer = answerDefault;
				}
			}
		});
	},

	run: function(msg) {
		let config = configHandler.readJSON(base + "/cfg/moduleConfigs/currencies.json", msg.getServer().getId());
		module.exports.pushUpdate(msg.getChannel(), config.currencies[loopIndex], config);
	},

	hook: function(channel) {
		let config = configHandler.readJSON(base + "/cfg/moduleConfigs/currencies.json", channel.getServer().getId());
		module.exports.pushUpdate(channel, config.currencies[loopIndex], config);
	}
};