const base = require("path").resolve(".");
const languageHandler = require(base + "/src/core/utils/languageHandler");

module.exports = {
	run: function(msg, client, command) {
		let pattern = new RegExp(command.regex, "i");

		switch (command.type) {
			case "js":
				require(base + "/" + command.path).run(msg, client, msg.getRegexGroups(pattern));
				return true;
			case "python":
				languageHandler.runScript("python3", base + "/" + command.path, msg.getContentArray(true), msg.getRegexGroups(pattern), msg.getTextChannel());
				return true;
			case "lua":
				languageHandler.runScript("lua", base + "/" + command.path, msg.getContentArray(true), msg.getRegexGroups(pattern), msg.getTextChannel());
				return true;
			default:
				return false;
		}
	}
};
