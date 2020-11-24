const base = require("path").resolve(".");
const languageHandler = require(base + "/src/core/utils/languageHandler");

module.exports = {
	run: function(msg, client, command) {
		let pattern = new RegExp(command.regex, "i"),
			sFullCommandPath = base + "/" + command.path,
			aRegexGroups = msg.getRegexGroups(pattern, true);

		switch (command.type) {
			case "js":
				require(sFullCommandPath).run(
					msg,
					client,
					aRegexGroups
				);
				return true;
			case "python":
				languageHandler.runScript(
					"python3",
					sFullCommandPath,
					msg.getContentArray(true),
					aRegexGroups,
					msg.getTextChannel()
				);
				return true;
			case "lua":
				languageHandler.runScript(
					"lua",
					sFullCommandPath,
					msg.getContentArray(true),
					aRegexGroups,
					msg.getTextChannel()
				);
				return true;
			default:
				return false;
		}
	}
};
