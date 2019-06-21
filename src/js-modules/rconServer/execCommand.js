const fs = require("fs");
const Rcon = require("srcds-rcon");

const base = require("path").resolve(".");

module.exports = {
	run: function (msg) {
		let serverName = msg.getContentArray() [1];
		let cfgPath = base + "/cfg/servers/" + msg.getServer().getId() + "/rconServer.json";
		let serverCfg;

		if (fs.existsSync(cfgPath)) {
			serverCfg = require(cfgPath);
		} else {
			msg.getChannel().send("There is no server registered yet. Use the 'rcon server_name add' command to register one.");
			return;
		}

		if (serverCfg !== undefined && serverCfg[serverName] !== undefined) {
			let address = serverCfg[serverName]["address"];
			let port = serverCfg[serverName]["port"];
			let password = serverCfg[serverName]["rcon_password"];
			let msgArray = msg.getContentArray() .slice(3, msg.getContentArray() .length);
			let cmd = "";

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
				msg.getChannel().send("Executing following command:\n```" + cmd + "```");

				return server.command(cmd, 2500).then(response => {
					console.log(`${new Date().toLocaleString()}: Server response: '${response}'`);

					if (response !== "") {
						msg.getChannel().send("Server response:\n```json\n" + response + "```");
					}
				});
			}).then(() => {
				server.disconnect();
			}).catch((err) => {
				console.error(`${new Date().toLocaleString()}: ${err}`);
				msg.getChannel().send("Following error occurred while making the server request:\n```" + err + "```");
			});
		} else {
			msg.getChannel().send(`There is no server called ${serverName}.`);
		}
	}
};