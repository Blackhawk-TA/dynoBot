const Discord = require("discord.js");
const base = require("path").resolve(".");

const security = require(base + "/cfg/security.json");
const commands = require(base + "/cfg/commands.json");

const configHandler = require(base + "/src/utils/configHandler");
const hooks = require(base + "/src/core/utils/hooks");
const scriptWrapper = require(base + "/src/core/utils/scriptWrapper");
const permissionHandler = require(base + "/src/core/utils/permissionHandler");

const client = new Discord.Client();

client.on("error", (error) => {
	console.error(error);
});

client.on("ready", () => {
	console.log(`${new Date().toLocaleString()}: Bot successfully started.`);

	//Init hooks
	var servers = client.guilds.array();

	servers.forEach((server) => {
		hooks.init(server);
	});
});

client.on('guildMemberAdd', member => {
	var pathConfig = base + "/cfg/config.json";
	var enabled = configHandler.readJSON(pathConfig, member.guild.id, "welcome_message", "enabled");
	var channelName = configHandler.readJSON(pathConfig, member.guild.id, "welcome_message", "channel");
	var part1 = configHandler.readJSON(pathConfig, member.guild.id, "welcome_message", "part1");
	var part2 = configHandler.readJSON(pathConfig, member.guild.id, "welcome_message", "part2");

	if (enabled) {
		var channel = member.guild.channels.find("name", channelName);

		if (!channel) return;
		channel.send(`${part1} ${member} ${part2}`);
	}
});

client.on("message", msg => {
	try {
		if (msg.isMentioned(client.user)) {
			//Pre-edit message
			msg.contentArray = msg.content.split(" ").splice(1, msg.content.length);

			var bAnswered = false;

			var i = 0;
			while (!bAnswered && i < commands.commandList.length) {
				var command = commands.commandList[i];
				var pattern = new RegExp(command.regex);

				if (pattern.test(msg.content.toLowerCase())) {
					msg.aRegexGroups = pattern.exec(msg.content);

					if (permissionHandler.hasPermissions(msg, command)) {
						bAnswered = scriptWrapper.run(command, msg, client);
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

client.login(security.token);