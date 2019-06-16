const request = require("request");

module.exports = {
	run: function(msg) {
		let answer = "";
		let sAmount = msg.getContentArray()[msg.getContentArray().length - 4];
		let amount = 1;
		if (!isNaN(sAmount)) {
			amount = parseFloat(sAmount);
		}
		let coin1 = msg.getContentArray()[msg.getContentArray().length - 3].toUpperCase();
		let coin2 = msg.getContentArray().pop().toUpperCase();

		let requestLink = "https://min-api.cryptocompare.com/data/price?fsym=" + coin1 + "&tsyms=" + coin2;
		request(requestLink, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				let data = JSON.parse(body);
				if (data[coin2] === undefined) {
					answer = "Hmm one of those currencies does not exist. Are you sure you aren't stupid?"
				} else {
					answer = "```js\n" + amount + " " + coin1 + " equals " + (Math.round(parseFloat(amount * data[coin2]) * 100) / 100) + " " + coin2 + ".```";
				}
			} else {
				answer = "Sorry I just can't handle the pressure... \nhttps://giphy.com/gifs/high-quality-relationship-programmer-UNZ3HQH0Enzos"
			}
			msg.channel.send(answer)
		});
	}
};