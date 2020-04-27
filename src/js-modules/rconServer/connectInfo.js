const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");

module.exports = {
	run: function (msg) {
		let serverName = msg.getContentArray(true)[1],
			serverCfgPath = base + "/cfg/modules/rconServer.json",
			serverCfg = configHandler.readJSON(serverCfgPath, msg.getServer().getId());

		if (serverCfg[serverName] !== undefined) {
			let address = serverCfg[serverName]["address"],
				port = serverCfg[serverName]["port"],
				password = serverCfg[serverName]["password"];

			let connectLink = `steam://connect/${address}:${port}/${password}`,
				connectCmd = `connect ${address}:${port}; password ${password};`;

			msg.getChannel().send("You can connect to the server using this link: " + connectLink +
				"\nAlternatively you can using following console command:```" + connectCmd + "```");
		} else {
			msg.getChannel().send(`There is no server called ${serverName}.`);
		}
	}
};
