const Rcon = require('node-source-rcon');

const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");
const cfgPath = base + "/cfg/moduleConfigs/rconServer.json";

module.exports = {
	run: function (msg) {
		var address = configHandler.readJSON(cfgPath, msg.guild.id, "server_settings", "address");
		var port = configHandler.readJSON(cfgPath, msg.guild.id, "server_settings", "port");
		var password = configHandler.readJSON(cfgPath, msg.guild.id, "server_settings", "rcon_password"); //remove message instantly after changing pw
		var msgArray = msg.contentArray;
		msgArray.shift();
		msgArray.shift();
		var cmd = "";

		msgArray.forEach(function(item) {
			cmd += item + " ";
		});
		cmd.trim();

		const server = new Rcon({
			host: address,
			port: port
		});

		server.authenticate(password).then(() => {
			console.log(`${new Date().toLocaleString()}: Logged into ${address}:${port} and executed '${cmd}'`);
			msg.channel.send("Executing following command:\n```" + cmd + "```");
			return server.execute(cmd);
		})
		.then((response) => {
			console.log(`${new Date().toLocaleString()}: Server response: '${response}'`);

			if (response !== "") {
				msg.channel.send("Server response:\n```" + response + "```");
			}
		})
		.catch((e) => {
			console.error(`${new Date().toLocaleString()}: ${e}`);
			msg.channel.send("Following error occurred while making the server request:\n```" + e + "```");
		});
	}
};