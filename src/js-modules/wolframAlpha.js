const base = require("path").resolve(".");
const security = require(base + "/cfg/security.json");

const WolframAlphaAPI = require("wolfram-alpha-api");
const base64Img = require('base64-img');
const fs = require("fs");

module.exports = {
	run: function (msg) {
		if (security.wolframAlphaAPI) {
			msg.channel.send("I'm processing your request, please wait...");

			var waApi = WolframAlphaAPI(security.wolframAlphaAPI);
			var question = msg.aRegexGroups[2];
			var guildId = msg.channel.guild.id;

			waApi.getSimple({
				i: question,
				width: 1024,
				background: '323232',
				foreground: 'white',
			}).then((result) => {
				var resourceDirectory = base + "/resources";
				var resultDirectory = resourceDirectory + "/servers/" + guildId;

				if (!fs.existsSync(resourceDirectory))
					fs.mkdirSync(resourceDirectory);

				if (!fs.existsSync(resourceDirectory + "/servers"))
					fs.mkdirSync(resourceDirectory + "/servers");

				if (!fs.existsSync(resultDirectory))
					fs.mkdirSync(resultDirectory);

				base64Img.img(result, resultDirectory, "lastWolframAlphaRequest", function (err, filePath) {
					var fileName = filePath.split("/").pop();
					msg.channel.send("This is the result of your request:\n", {
						files: [{
							attachment: filePath,
							name: fileName
						}]
					});
				});

			}).catch((error) => {
				console.log(`${new Date().toLocaleString()}: ${error}`);
				msg.channel.send("Following problem occurred:\n```" + error + "```");
			});
		} else {
			msg.channel.send("My owner hasn't set up the Wolfram|Alpha module.")
		}
	}
};