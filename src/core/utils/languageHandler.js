const spawn = require("child_process").spawn;

const base = require("path").resolve(".");
const logger = require(base + "/src/utils/logger");

module.exports = {
	runScript: function(interpreter, path, msgArray, msgRegexGroups, channel) {
		let process = spawn(interpreter, [path, msgArray, msgRegexGroups]);
		process.stdout.on("data", data => {
			channel.send(data.toString());
		});
		process.stderr.on("data", data => {
			channel.send("There was a problem while executing this command. Please contact the person hosting the bot.");
			logger.error(`Child stderr on running script:\n${data}`);
		});
		process.on("error", err => {
			channel.send("There was a problem while executing this command. Please contact the person hosting the bot.");
			logger.error("Could not run script: ", err);
		});
	}
};
