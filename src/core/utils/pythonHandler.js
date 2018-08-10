const spawn = require("child_process").spawn;

module.exports = {
	run: function(path, msgArray, msgRegexGroups, channel) {
		var pythonProcess = spawn("python3",[path, msgArray, msgRegexGroups]);
		pythonProcess.stdout.on('data', function (data){
			channel.send(data.toString());
		});
	}
};