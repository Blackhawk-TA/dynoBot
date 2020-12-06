const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const config = require(base + "/cfg/config.json");
const logger = require(base + "/src/utils/logger");

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
		} catch (err) {
			logger.error("Failed to parse string: ", err);
		}

		if (config[id] !== undefined && config[id][entry] !== undefined) {
			configHandler.editJSON(msg.getTextChannel(), pathCfg, id, entry, value);
		} else {
			msg.getTextChannel().send(`Sorry, but the config entry ${id}.${entry} does not exist.`);
		}
	}
};
