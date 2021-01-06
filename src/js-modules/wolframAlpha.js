const base = require("path").resolve(".");
const security = require(base + "/cfg/security.json");

const WolframAlphaAPI = require("wolfram-alpha-api");
const logger = require(base + "/src/utils/logger");

module.exports = {
	run: function(msg, client, regexGroups) {
		if (security.wolframAlphaAPI) {
			msg.getTextChannel().send("I'm processing your request, please wait...");

			let waApi = WolframAlphaAPI(security.wolframAlphaAPI);
			let question = regexGroups[2];

			waApi.getSimple({
				i: question,
				width: 1024,
				background: "323232",
				foreground: "white",
			}).then(result => {
				let regex = /^data:image\/[\w+]+;base64,([\s\S]+)/;
				let match = result.match(regex);

				if (!match) {
					msg.getTextChannel().send("Could not resolve your request.");
					logger.error("The wolframAlpha request image has a base64 data error");
					return;
				}

				let image = Buffer.from(match[1], "base64");
				msg.getTextChannel().send("This is the result of your request:\n", {
					files: [{
						attachment: image
					}]
				});
			}).catch(error => {
				logger.warn("WolframAlpha request failed: ", error);
				msg.getTextChannel().send("Following problem occurred:\n```" + error + "```");
			});
		} else {
			msg.getTextChannel().send("My owner hasn't set up the Wolfram|Alpha module.");
		}
	}
};
