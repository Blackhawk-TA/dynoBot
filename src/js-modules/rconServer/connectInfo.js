const base = require("path").resolve(".");

module.exports = {
	run: function (msg) {
		let serverName = msg.getContentArray(true)[1];
		let serverCfg = require(base + "/cfg/servers/" + msg.getServer().getId() + "/rconServer.json");

		if (serverCfg[serverName] !== undefined) {
			let address = serverCfg[serverName]["address"];
			let port = serverCfg[serverName]["port"];
			let password = serverCfg[serverName]["password"];

			let connectLink = `steam://connect/${address}:${port}/${password}`;
			let connectCmd = `connect ${address}:${port}; password ${password};`;

			msg.getChannel().send("You can connect to the server using this link: " + connectLink +
				"\nAlternatively you can using following console command:```" + connectCmd + "```");
		} else {
			msg.getChannel().send(`There is no server called ${serverName}.`);
		}
	}
};