const base = require("path").resolve(".");
const languageHandler = require(base + "/src/core/utils/languageHandler");

module.exports = {
	run: function(command, msg, client) {
		switch (command.type) {
			case "js":
				require(base + "/" + command.path).run(msg, client);
				return true;
			case "python":
				languageHandler.runPythonModule(base + "/" + command.path, msg.contentArray, msg.aRegexGroups, msg.channel);
				return true;
			case "lua":
				languageHandler.runLuaModule(base + "/" + command.path, msg.contentArray, msg.aRegexGroups, msg.channel);
				return true;
			default:
				return false;
		}
	}
};