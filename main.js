const base = require("path").resolve(".");

const security = require(base + "/cfg/security.json");
const commands = require(base + "/cfg/commands.json");

const configHandler = require(base + "/src/utils/configHandler");
const hooks = require(base + "/src/core/utils/hooks");
const scriptWrapper = require(base + "/src/core/utils/scriptWrapper");
const permissionHandler = require(base + "/src/core/utils/permissionHandler");

const {DiscordBot} = require("dynobot-framework");
const Bot = new DiscordBot(security.token);

Bot.client.registerEvent("error");
Bot.client.registerEvent("ready");
Bot.client.registerEvent("guildMemberAdd");
Bot.client.registerEvent("message");

Bot.client.events.on("error", (error) => {
	console.error(error);
});

Bot.client.events.on("ready", () => {
	console.log(`${new Date().toLocaleString()}: Bot successfully started.`);

	//Init hooks
	let servers = Bot.client.getServers();

	servers.forEach((server) => {
		hooks.init(server);
	});

	Bot.client.events.on("guildMemberAdd", member => {
		let pathConfig = base + "/cfg/config.json",
			enabled = configHandler.readJSON(pathConfig, member.getServer().getId(), "welcome_message", "enabled"),
			channelName = configHandler.readJSON(pathConfig, member.getServer().getId(), "welcome_message", "channel"),
			part1 = configHandler.readJSON(pathConfig, member.getServer().getId(), "welcome_message", "part1"),
			part2 = configHandler.readJSON(pathConfig, member.getServer().getId(), "welcome_message", "part2");

		if (enabled) {
			member.getServer().getChannels().forEach(channel => {
				if (channel.getName() === channelName) {
					channel.send(`${part1} ${member} ${part2}`);
				}
			});
		}
	});

	Bot.client.events.on("message", msg => {
		try {
			if (msg.isMentioned(Bot.client.user)) {
				let bAnswered = false,
					i = 0;
				while (!bAnswered && i < commands.commandList.length) {
					let command = commands.commandList[i],
						pattern = new RegExp(command.regex);

					if (pattern.test(msg.getContent().toLowerCase())) {
						if (permissionHandler.hasPermissions(msg, command)) {
							bAnswered = scriptWrapper.run(command, msg, Bot.client);
						} else {
							bAnswered = true;
							msg.channel.send("You don't have access to this command.");
						}
					}
					i++;
				}

				if (!bAnswered) {
					msg.channel.send("Sorry, I can't help you with that.");
				}
			}
		} catch (e) {
			console.error(e);
		}
	});
});
