const base = require("path").resolve(".");
const languageHandler = require(base + "/src/core/utils/languageHandler");

module.exports = {
	run: function(command, msg, client) {
		let pattern = new RegExp(command.regex);

		switch (command.type) {
			case "js":
				require(base + "/" + command.path).run(msg, client);
				return true;
			case "python":
				languageHandler.runScript("python3", base + "/" + command.path, msg.getContentArray(), msg.getRegexGroups(pattern), msg.channel);
				return true;
			case "lua":
				languageHandler.runScript("lua", base + "/" + command.path, msg.getContentArray(), msg.getRegexGroups(pattern), msg.channel);
				return true;
			default:
				return false;
		}
	}
};