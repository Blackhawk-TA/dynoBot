const spawn = require("child_process").spawn;

module.exports = {
	runPythonModule: function(path, msgArray, msgRegexGroups, channel) {
		let pythonProcess = spawn("python3", [path, msgArray, msgRegexGroups]);
		pythonProcess.stdout.on('data', function (data) {
			channel.send(data.toString());
		});
		pythonProcess.stderr.on('data', (data) => {
			console.error(`child stderr:\n${data}`);
		});
	},

	runLuaModule: function(path, msgArray, msgRegexGroups, channel) {
		let luaProcess = spawn("lua", [path, msgArray, msgRegexGroups]);
		luaProcess.stdout.on('data', function (data) {
			channel.send(data.toString());
		});
		luaProcess.stderr.on('data', (data) => {
			console.error(`child stderr:\n${data}`);
		});
	}
};