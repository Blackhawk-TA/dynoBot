const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const config = require(base + "/cfg/config.json");

module.exports = {
	run: function(msg) {
		var pathCfg = base + "/cfg/config.json";
		var id = msg.contentArray[2];
		var entry = msg.contentArray[3];
		var value = "";
		var valueStartIndex = 5;

		for (var i = valueStartIndex; i < msg.contentArray.length; i++) {
			value += " " + msg.contentArray[i];
		}

		value = value.trim();

		try { //TODO remove ugly workaround
			value = JSON.parse(value);
		} catch (e) {
			console.error(`${new Date().toLocaleString()}: Tried to parse string => ${e}`);
		}

		if (config[id] && config[id][entry]) {
			configHandler.editJSON(msg.channel, pathCfg, id, entry, value);
		} else {
			msg.channel.send(`Sorry, but the config entry ${id}.${entry} does not exist.`);
		}
	}
};