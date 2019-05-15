const fs = require("fs");

const base = require("path").resolve(".");
const Rcon = require(base + '/resources/deprecated_modules/node-source-rcon');

module.exports = {
	run: function (msg) {
		var serverName = msg.contentArray[1];
		var cfgPath = base + "/cfg/servers/" + msg.guild.id + "/rconServer.json";
		var serverCfg;

		if (fs.existsSync(cfgPath)) {
			serverCfg = require(cfgPath);
		} else {
			msg.channel.send("There is no server registered yet. Use the 'rcon server_name add' command to register one.");
			return;
		}

		if (serverCfg !== undefined && serverCfg[serverName] !== undefined) {
			var address = serverCfg[serverName]["address"];
			var port = serverCfg[serverName]["port"];
			var password = serverCfg[serverName]["rcon_password"];
			var msgArray = msg.contentArray.slice(3, msg.contentArray.length);
			var cmd = "";

			msgArray.forEach(function (item) {
				cmd += item + " ";
			});
			cmd.trim();

			const server = new Rcon({
				host: address,
				port: port,
				timeout: 2500
			});

			server.authenticate(password).then(() => {
				console.log(`${new Date().toLocaleString()}: Logged into ${address}:${port} and executed '${cmd}'`);
				msg.channel.send("Executing following command:\n```" + cmd + "```");
				return server.execute(cmd);
			})
			.then((response) => {
				console.log(`${new Date().toLocaleString()}: Server response: '${response}'`);

				if (response !== "") {
					msg.channel.send("Server response:\n```json\n" + response + "```");
				}
			})
			.catch((e) => {
				console.error(`${new Date().toLocaleString()}: ${e}`);
				msg.channel.send("Following error occurred while making the server request:\n```" + e + "```");
			});
		} else {
			msg.channel.send(`There is no server called ${serverName}.`);
		}
	}
};