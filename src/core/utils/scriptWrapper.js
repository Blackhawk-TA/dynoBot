const base = require("path").resolve(".");
const pyHandler = require(base + "/src/core/utils/pythonHandler");

module.exports = {
	run: function(command, msg, client) {
		if (command.type === "js") {
			require(base + "/" + command.path).run(msg, client);
			return true;
		} else if (command.type === "python") {
			pyHandler.run(base + "/" + command.path, msg.contentArray, msg.aRegexGroups, msg.channel);
			return true;
		} else {
			return false;
		}
	}
};