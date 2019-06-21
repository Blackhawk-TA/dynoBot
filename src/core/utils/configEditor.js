const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const config = require(base + "/cfg/config.json");

module.exports = {
	run: function(msg) {
		let pathCfg = base + "/cfg/config.json";
		let id = msg.getContentArray()[3];
		let entry = msg.getContentArray()[4];
		let value = "";
		let valueStartIndex = 6;

		for (let i = valueStartIndex; i < msg.getContentArray().length; i++) {
			value += " " + msg.getContentArray()[i];
		}

		value = value.trim();

		try { //TODO remove ugly workaround
			value = JSON.parse(value);
		} catch (e) {
			console.error(`${new Date().toLocaleString()}: Tried to parse string => ${e}`);
		}

		if (config[id] && config[id][entry]) {
			configHandler.editJSON(msg.getChannel(), pathCfg, id, entry, value);
		} else {
			msg.getChannel().send(`Sorry, but the config entry ${id}.${entry} does not exist.`);
		}
	}
};