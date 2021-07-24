const base = require("path").resolve(".");
const logger = require(base + "/src/utils/logger");
const fetch = require("node-fetch");

module.exports = {
	run: function(msg) {
		let answer = "",
			contentArray = msg.getContentArray(true),
			sAmount = contentArray[contentArray.length - 4],
			amount = 1;

		if (!isNaN(sAmount)) {
			amount = parseFloat(sAmount);
		}

		let coin1 = contentArray[contentArray.length - 3].toUpperCase();
		let coin2 = contentArray.pop().toUpperCase();

		let requestLink = "https://min-api.cryptocompare.com/data/price?fsym=" + coin1 + "&tsyms=" + coin2;
		fetch(requestLink)
			.then(response => response.json())
			.then(data => {
				if (data[coin2] === undefined) {
					answer = "One of those currencies does not exist.";
				} else {
					answer = "```js\n" + amount + " " + coin1 + " equals " + (Math.round((amount * data[coin2]) * 100) / 100) + " " + coin2 + ".```";
				}
				msg.getTextChannel().send(answer);
			})
			.catch(error => {
				msg.getTextChannel().send("Could not request currency prices.");
				logger.error(`Could not request currency prices:\n${error}`);
			});
	}
};
