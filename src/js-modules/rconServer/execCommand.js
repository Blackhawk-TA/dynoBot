const fs = require("fs");
const Rcon = require("srcds-rcon");

const base = require("path").resolve(".");
const logger = require(base + "/src/utils/logger");

module.exports = {
	run: function (msg) {
		let serverName = msg.getContentArray(true)[1],
			cfgPath = base + "/cfg/servers/" + msg.getServer().getId() + "/rconServer.json",
			serverCfg;

		if (fs.existsSync(cfgPath)) {
			serverCfg = require(cfgPath);
		} else {
			msg.getTextChannel().send("There is no server registered yet. Use the 'rcon server_name add' command to register one.");
			return;
		}

		if (serverCfg && serverCfg[serverName]) {
			let address = serverCfg[serverName]["address"],
				port = serverCfg[serverName]["port"],
				password = serverCfg[serverName]["rcon_password"],
				msgArray = msg.getContentArray(true).slice(3, msg.getContentArray(true).length),
				cmd = "";

			msgArray.forEach(function (item) {
				cmd += item + " ";
			});
			cmd = cmd.trim();

			const server = Rcon({
				address: `${address}:${port}`,
				password: password
			});

			server.connect().then(() => {
				logger.info(`Logged into ${address}:${port} and executed '${cmd}'`);
				msg.getTextChannel().send("Executing following command:\n```" + cmd + "```");

				return server.command(cmd, 2500).then(response => {
					logger.info(`Server response: '${response}'`);

					if (response !== "") {
						msg.getTextChannel().send("Server response:\n```json\n" + response + "```");
					}
				});
			}).then(() => {
				server.disconnect();
			}).catch((err) => {
				logger.warn("Could not connect to rcon server: ", err);
				msg.getTextChannel().send("Following error occurred while making the server request:\n```" + err + "```");
			});
		} else {
			msg.getTextChannel().send(`There is no server called ${serverName}.`);
		}
	}
};
