const base = require("path").resolve(".");

const security = require(base + "/cfg/security.json");
const commands = require(base + "/cfg/commands.json");

const configHandler = require(base + "/src/utils/configHandler");
const hooks = require(base + "/src/core/utils/hooks");
const scriptWrapper = require(base + "/src/core/utils/scriptWrapper");
const permissionHandler = require(base + "/src/core/utils/permissionHandler");

const {DiscordBot} = require("dynobot-framework");
const Bot = new DiscordBot(security.token);

Bot.onEvent("ready", () => {
	console.log(`${new Date().toLocaleString()}: Bot successfully started.`);

	Bot.onEvent("error", err => {
		console.error(`${new Date().toLocaleString()}: ${err}`);
	});

	//Init hooks
	let servers = Bot.getClient().getServers();

	servers.forEach((server) => {
		hooks.init(server);
	});

	Bot.onEvent("serverMemberAdd", member => {
		let pathConfig = base + "/cfg/config.json",
			enabled = configHandler.readJSON(pathConfig, member.getServer().getId(), "welcome_message", "enabled"),
			channelName = configHandler.readJSON(pathConfig, member.getServer().getId(), "welcome_message", "channel"),
			part1 = configHandler.readJSON(pathConfig, member.getServer().getId(), "welcome_message", "part1"),
			part2 = configHandler.readJSON(pathConfig, member.getServer().getId(), "welcome_message", "part2");

		if (enabled) {
			member.getServer().getTextChannels().forEach(channel => {
				if (channel.getName() === channelName) {
					channel.send(`${part1}<@${member.getId()}>${part2}`);
				}
			});
		}
	});

	Bot.onEvent("message", msg => {
		try {
			let BotUser = Bot.getClient().getUser();
			if (msg.isMentioned(BotUser) && msg.getAuthor().getId() !== BotUser.getId()) {
				let bAnswered = false,
					i = 0;
				while (!bAnswered && i < commands.commandList.length) {
					let command = commands.commandList[i],
						pattern = new RegExp(command.regex);

					if (pattern.test(msg.getContent(true).toLowerCase().trim())) {
						if (permissionHandler.hasPermissions(msg, command)) {
							bAnswered = scriptWrapper.run(msg, Bot.getClient(), command);
						} else {
							bAnswered = true;
							msg.getTextChannel().send("You don't have access to this command.");
						}
					}
					i++;
				}

				if (!bAnswered) {
					msg.getTextChannel().send("Sorry, I can't help you with that.");
				}
			}
		} catch (err) {
			console.error(`${new Date().toLocaleString()}: ${err}`);
		}
	});
});
