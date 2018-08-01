const fs = require("fs");

const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const pathCfg = base + "/cfg/moduleConfigs/rconServer.json";

module.exports = {
	run: function (msg) {
		var serverCfgPath = base + "/cfg/servers/" + msg.guild.id + "/rconServer.json";
		var serverCfg = {};

		if (fs.existsSync(serverCfgPath)) {
			serverCfg = require(serverCfgPath);
		}

		var id = msg.contentArray[3];
		var entry = msg.contentArray[4];
		var value = msg.contentArray[6];

		if (serverCfg[id] && serverCfg[id][entry]) {
			var showResult = entry !== "rcon_password";
			configHandler.editJSON(msg.channel, pathCfg, id, entry, value, showResult);

			if (!showResult) {
				if (msg.deletable) {
					msg.delete()
						.then(msg => console.log(`${new Date().toLocaleString()}: Deleted message from ${msg.author.username}`))
						.catch(console.error);
					msg.channel.send("Your message has been deleted due to security reasons.");
				} else {
					msg.channel.send("Your message couldn't be deleted, if you want to protect your server rcon password please grant me the right to delete messages.");
				}
			}
		} else {
			msg.channel.send(`Sorry, but the config entry ${id}.${entry} does not exist.`);
		}
	}
};