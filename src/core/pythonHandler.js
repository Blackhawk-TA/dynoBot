const spawn = require("child_process").spawn;

module.exports = {
	run: function(path, msg, channel) {
		var pythonProcess = spawn("python",[path, msg]);
		pythonProcess.stdout.on('data', function (data){
			channel.send(data.toString());
		});
	}
};