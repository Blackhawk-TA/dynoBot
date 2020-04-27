const base = require("path").resolve(".");
const security = require(base + "/cfg/security.json");

const WolframAlphaAPI = require("wolfram-alpha-api");
const base64Img = require("base64-img");
const fs = require("fs");

module.exports = {
	run: function (msg, client, regexGroups) {
		if (security.wolframAlphaAPI) {
			msg.getTextChannel().send("I'm processing your request, please wait...");

			let waApi = WolframAlphaAPI(security.wolframAlphaAPI);
			let question = regexGroups[2];
			let serverId = msg.getTextChannel().getServer().getId();

			waApi.getSimple({
				i: question,
				width: 1024,
				background: "323232",
				foreground: "white",
			}).then((result) => {
				let resourceDirectory = base + "/resources";
				let resultDirectory = resourceDirectory + "/servers/" + serverId;

				if (!fs.existsSync(resourceDirectory))
					fs.mkdirSync(resourceDirectory);

				if (!fs.existsSync(resourceDirectory + "/servers"))
					fs.mkdirSync(resourceDirectory + "/servers");

				if (!fs.existsSync(resultDirectory))
					fs.mkdirSync(resultDirectory);

				base64Img.img(result, resultDirectory, "lastWolframAlphaRequest", function (err, filePath) {
					let fileName = filePath.split("/").pop();
					msg.getTextChannel().send("This is the result of your request:\n", {
						files: [{
							attachment: filePath,
							name: fileName
						}]
					});
				});

			}).catch((error) => {
				console.log(`${new Date().toLocaleString()}: ${error}`);
				msg.getTextChannel().send("Following problem occurred:\n```" + error + "```");
			});
		} else {
			msg.getTextChannel().send("My owner hasn't set up the Wolfram|Alpha module.");
		}
	}
};
