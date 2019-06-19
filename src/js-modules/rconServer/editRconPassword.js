const fs = require("fs");

const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const pathCfg = base + "/cfg/moduleConfigs/rconServer.json";

module.exports = {
	run: function(msg) {
		let serverCfgPath = base + "/cfg/servers/" + msg.getServer().getId() + "/rconServer.json";
		let rconServer = msg.getContentArray()[5];

		if (fs.existsSync(serverCfgPath)) {
			let serverCfg = configHandler.readJSON(serverCfgPath, msg.getServer().getId(), rconServer);
			let rconConfig = configHandler.readJSON(serverCfgPath, msg.getServer().getId());

			if (serverCfg !== rconConfig) {
				msg.channel.send("I've sent you a private message with further instructions.");

				let user = msg.getAuthor();

				user.createDM().then((resolved) => {
					resolved.send(`Hello ${user.getName()}, you requested to change the rcon password of '${rconServer}' on the server '${msg.getServer().getName()}'.`
						+ " Please enter the rcon password within the next 60 seconds.");

					let pattern = new RegExp(/(.+)/);
					let filter = m => pattern.test(m.content) && m.author.id === msg.getAuthor().getId(); //TODO fix m not being wrapped

					resolved.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
						.then((collected) => {
							let answer = collected[0].getContent();

							resolved.send(`The rcon password of '${rconServer}' has been changed to '${answer}'.`);
							configHandler.editJSON(msg.channel, pathCfg, rconServer, "rcon_password", answer, false);
						})
						.catch((reason) => {
							console.error(reason);
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