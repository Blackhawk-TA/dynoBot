const fs = require("fs");

const base = require("path").resolve(".");

const logger = require(base + "/src/utils/logger");
const configHandler = require(base + "/src/utils/configHandler");
const pathCfg = base + "/cfg/modules/rconServer.json";

module.exports = {
	run: function(msg) {
		let serverCfgPath = base + "/cfg/servers/" + msg.getServer().getId() + "/rconServer.json";
		let rconServer = msg.getContentArray(true)[4];

		if (fs.existsSync(serverCfgPath)) {
			let serverCfg = configHandler.readJSON(serverCfgPath, msg.getServer().getId(), rconServer);
			let rconConfig = configHandler.readJSON(serverCfgPath, msg.getServer().getId());

			if (serverCfg !== rconConfig) {
				msg.getTextChannel().send("I've sent you a private message with further instructions.");

				let user = msg.getAuthor();

				user.createDM().then((resolved) => {
					resolved.send(`Hello ${user.getName()}, you requested to change the rcon password of '${rconServer}' on the server '${msg.getServer().getName()}'.`
						+ " Please enter the rcon password within the next 60 seconds.");

					resolved.awaitMessages({max: 2, time: 60000, errors: ["time"]})
						.then((collected) => {
							if (collected[1].getContent() && collected[1].getAuthor().getId() === msg.getAuthor().getId()) {
								let answer = collected[1].getContent(true);
								resolved.send(`The rcon password of '${rconServer}' has been changed to '${answer}'.`);
								configHandler.editJSON(msg.getTextChannel(true), pathCfg, rconServer, "rcon_password", answer, false);
							} else {
								resolved.send("The password could not be changed. Please try again.");
								msg.getTextChannel().send("The password could not be changed. Please try again.");
							}
						})
						.catch(err => {
							logger.warn("Could not fetch messages: ", err);
							resolved.send("The time for entering the password has passed. Please request a new rcon password change.");
							msg.getTextChannel().send("The time for entering the password has passed. Please request a new rcon password change.");
						});
				}).catch(err => {
					logger.error("Could not create direct message: ", err);
				});
			} else {
				msg.getTextChannel().send(`There is no rcon server called '${rconServer}'.`);
			}
		} else {
			msg.getTextChannel().send("This server has no rcon server config yet, please add one using the 'rcon add' command.");
		}
	}
};
