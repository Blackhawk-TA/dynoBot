const fs = require("fs");
const Rcon = require("srcds-rcon");

const base = require("path").resolve(".");

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
				console.log(`${new Date().toLocaleString()}: Logged into ${address}:${port} and executed '${cmd}'`);
				msg.getTextChannel().send("Executing following command:\n```" + cmd + "```");

				return server.command(cmd, 2500).then(response => {
					console.log(`${new Date().toLocaleString()}: Server response: '${response}'`);

					if (response !== "") {
						msg.getTextChannel().send("Server response:\n```json\n" + response + "```");
					}
				});
			}).then(() => {
				server.disconnect();
			}).catch((err) => {
				console.error(`${new Date().toLocaleString()}: ${err}`);
				msg.getTextChannel().send("Following error occurred while making the server request:\n```" + err + "```");
			});
		} else {
			msg.getTextChannel().send(`There is no server called ${serverName}.`);
		}
	}
};
