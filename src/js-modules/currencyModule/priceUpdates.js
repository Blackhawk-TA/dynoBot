const request = require("request");

const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");

var loopIndex = 0;
var answerDefault = "Current market situation:```js\n";
var answer = answerDefault;

module.exports = {
	pushUpdate: function(channel, currency, config) {
		var self = this;

		request("https://min-api.cryptocompare.com/data/price?fsym=" + currency + "&tsyms=EUR,USD", function (error, response, body) {
			if (!error && response.statusCode === 200) {
				var data = JSON.parse(body);
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
		var config = configHandler.readJSON(base + "/cfg/moduleConfigs/currencies.json", msg.guild.id);
		module.exports.pushUpdate(msg.channel, config.currencies[loopIndex], config);
	},

	hook: function(channel) {
		var config = configHandler.readJSON(base + "/cfg/moduleConfigs/currencies.json", channel.guild.id);
		module.exports.pushUpdate(channel, config.currencies[loopIndex], config);
	}
};