const spawn = require("child_process").spawn;

module.exports = {
	runScript: function(interpreter, path, msgArray, msgRegexGroups, channel) {
		let process = spawn(interpreter, [path, msgArray, msgRegexGroups]);
		process.stdout.on("data", data => {
			channel.send(data.toString());
		});
		process.stderr.on("data", data => {
			channel.send("There was a problem while executing this command. Please contact the person hosting the bot.");
			console.error(`${new Date().toLocaleString()}: child stderr:\n${data}`);
		});
		process.on("error", err => {
			channel.send("There was a problem while executing this command. Please contact the person hosting the bot.");
			console.error(`${new Date().toLocaleString()}: ${err}`);
		});
	}
};
