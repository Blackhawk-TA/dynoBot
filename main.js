const Discord = require("discord.js");

const config = require("./cfg/config.json");
const security = require("./cfg/security.json");
const commands = require("./cfg/commands.json");
const pyHandler = require("./src/core/pythonHandler");

const client = new Discord.Client();


//Import js modules
const testModule = require("./src/js-modules/test-js.js");

client.on("ready", () => {
	console.log("Bot successfully started.");
});

client.on("message", msg => {
	if (msg.isMentioned(client.user)) {
		//Pre-edit message
		msg.content = msg.content.toLowerCase();
		msg.contentArray = msg.content.split(" ").splice(1, msg.content.length);

		var bAnswered = false;

		for (var i in commands) {
			var command = commands[i];
			var pattern = new RegExp(command.regex);
			if (pattern.test(msg.content)) {
				if (command.type === "js") {
					require("./" + command.path).run(msg);
					bAnswered = true;
					break;
				} else if (command.type === "python") {
					pyHandler.run(command.path, msg.contentArray, msg.channel);
					bAnswered = true;
					break;
				}
			}
		}

		if (!bAnswered) {
			msg.channel.send("Sorry, I can't help you with that.")
		}
	}
});

client.login(security.token);