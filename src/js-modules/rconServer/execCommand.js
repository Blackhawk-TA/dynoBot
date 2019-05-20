const fs = require("fs");
const Rcon = require("srcds-rcon");

const base = require("path").resolve(".");

module.exports = {
	run: function (msg) {
		let serverName = msg.contentArray[1];
		let cfgPath = base + "/cfg/servers/" + msg.guild.id + "/rconServer.json";
		let serverCfg;

		if (fs.existsSync(cfgPath)) {
			serverCfg = require(cfgPath);
		} else {
			msg.channel.send("There is no server registered yet. Use the 'rcon server_name add' command to register one.");
			return;
		}

		if (serverCfg !== undefined && serverCfg[serverName] !== undefined) {
			let address = serverCfg[serverName]["address"];
			let port = serverCfg[serverName]["port"];
			let password = serverCfg[serverName]["rcon_password"];
			let msgArray = msg.contentArray.slice(3, msg.contentArray.length);
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
				msg.channel.send("Executing following command:\n```" + cmd + "```");

				return server.command(cmd, 2500).then(response => {
					console.log(`${new Date().toLocaleString()}: Server response: '${response}'`);

					if (response !== "") {
						msg.channel.send("Server response:\n```json\n" + response + "```");
					}
				});
			}).then(() => {
				server.disconnect();
			}).catch((err) => {
				console.error(`${new Date().toLocaleString()}: ${err}`);
				msg.channel.send("Following error occurred while making the server request:\n```" + err + "```");
			});
		} else {
			msg.channel.send(`There is no server called ${serverName}.`);
		}
	}
};