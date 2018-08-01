const base = require("path").resolve(".");

module.exports = {
	run: function (msg) {
		var serverName = msg.contentArray[1];
		var serverCfg = require(base + "/cfg/servers/" + msg.guild.id + "/rconServer.json");

		if (serverCfg[serverName] !== undefined) {
			var address = serverCfg[serverName]["address"];
			var port = serverCfg[serverName]["port"];
			var password = serverCfg[serverName]["rcon_password"];


			var connectLink = `steam://connect/${address}:${port}/${password}`;
			var connectCmd = `connect ${address}:${port}; password ${password};`;

			msg.channel.send("You can connect to the server using this link: " + connectLink +
				"\n Alternatively you can using following console command:```" + connectCmd + "```");
		} else {
			msg.channel.send(`There is no server called ${serverName}.`);
		}
	}
};