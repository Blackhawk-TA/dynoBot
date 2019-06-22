const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const config = require(base + "/cfg/config.json");

module.exports = {
	run: function(msg) {
		let contentArray = msg.getContentArray(true),
			pathCfg = base + "/cfg/config.json",
			id = contentArray[2],
			entry = contentArray[3],
			value = "",
			valueStartIndex = 5;

		for (let i = valueStartIndex; i < contentArray.length; i++) {
			value += " " + contentArray[i];
		}

		value = value.trim();

		try {
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