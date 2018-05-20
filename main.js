const Discord = require("discord.js");

const config = require("./cfg/config.json");
const security = require("./cfg/security.json");
const commands = require("./cfg/commands.json");
const hookJson = require("./cfg/hooks.json");

const pyHandler = require("./src/core/pythonHandler");
const hooks = require("./src/core/hooks");

const client = new Discord.Client();

client.on("ready", () => {
	console.log("Bot successfully started.");

	//Init hooks
	hooks.init(client.channels);
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
			if (msg.content.includes("hook")) {
				if (msg.content.includes("config")) {
					msg.channel.send("```json\n" + JSON.stringify(hookJson, null, 4) + "```");
				} else if (msg.content.includes("channel")) {
					var name = msg.contentArray[msg.contentArray.length - 3];
					var channelId = msg.contentArray[msg.contentArray.length - 1];
					hooks.changeEntry(name, msg.channel, "channel", channelId);
				} else if (msg.content.includes("interval")) {
					var name = msg.contentArray[msg.contentArray.length - 3];
					var interval = msg.contentArray[msg.contentArray.length - 1];

					if (isFinite(interval * 60000) && interval > 0) {
						hooks.changeEntry(name, msg.channel, "interval", interval * 60000);
					} else {
						msg.channel.send(interval + " is not allowed as interval.")
					}
				} else if (msg.content.includes("enable") || msg.content.includes("on")) {
					var name = msg.contentArray[msg.contentArray.length - 1];
					hooks.changeEntry(name, msg.channel, "running", true);
				} else if (msg.content.includes("disable") || msg.content.includes("off")) {
					var name = msg.contentArray[msg.contentArray.length - 1];
					hooks.changeEntry(name, msg.channel, "running", false);
				} else {
					msg.channel.send("Sorry, I can't help you with that.");
				}
			} else {
				msg.channel.send("Sorry, I can't help you with that.");
			}
		}
	}
});

client.login(security.token);