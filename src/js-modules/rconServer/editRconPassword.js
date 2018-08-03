const fs = require("fs");

const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const pathCfg = base + "/cfg/moduleConfigs/rconServer.json";

module.exports = {
	run: function(msg) {
		var serverCfgPath = base + "/cfg/servers/" + msg.guild.id + "/rconServer.json";
		var rconServer = msg.contentArray[4];
		var messages = [];

		if (fs.existsSync(serverCfgPath)) {
			var serverCfg = configHandler.readJSON(serverCfgPath, msg.guild.id, rconServer);
			var rconConfig = configHandler.readJSON(serverCfgPath, msg.guild.id);

			if (serverCfg !== rconConfig) {
				messages.push(msg.channel.send("I've sent you a private message with further instructions."));

				var user = msg.author;
				var dmChannel = user.createDM();

				user.send(`Hello ${user.username}, you requested to change the rcon password of '${rconServer}' on the server '${msg.guild.name}'.`
					+ " Please enter the rcon password within the next 60 seconds.");

				dmChannel.then((resolved) => {
					var pattern = new RegExp(/(.+)/);
					var filter = m => pattern.test(m.content) && m.author === msg.author;

					resolved.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
						.then((collected) => {
							var answer = collected.array()[0].content;

							resolved.send(`The rcon password of '${rconServer}' has been changed to '${answer}'.`);
							configHandler.editJSON(msg.channel, pathCfg, rconServer, "rcon_password", answer, false);
						})
						.catch(() => {
							resolved.send("The time for entering the password has passed. Please request a new rcon password change.");
							msg.channel.send("The time for entering the password has passed. Please request a new rcon password change.");
						});
				}).catch(console.error);
			} else {
				msg.channel.send(`There is no rcon server called '${rconServer}'.`);
			}
		} else {
			msg.channel.send("This server has no rcon server config yet, please add one using the 'rcon add' command.");
		}
	}
};