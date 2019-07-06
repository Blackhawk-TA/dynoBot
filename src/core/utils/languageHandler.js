const spawn = require("child_process").spawn;

module.exports = {
	runScript: function(interpreter, path, msgArray, msgRegexGroups, channel) {
		let process = spawn(interpreter, [path, msgArray, msgRegexGroups]);
		process.stdout.on("data", function (data) {
			channel.send(data.toString());
		});
		process.stderr.on("data", (data) => {
			channel.send("There was a problem while executing this command. Please contact the person hosting the bot.");
			console.error(`child stderr:\n${data}`);
		});
		process.on("error", (e) => {
			channel.send("There was a problem while executing this command. Please contact the person hosting the bot.");
			console.error(e);
		});
	}
};