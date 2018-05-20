const fs = require("fs");
const pyHandler = require("./pythonHandler");
const hooks = require("./../../cfg/hooks.json");

module.exports = {
	init: function(channels) {
		for (var i in hooks) {
			var type = hooks[i].type;
			var path = hooks[i].path;
			var interval = hooks[i].interval;

			var update = function() {
				interval = hooks[i].interval;
				var channel = channels.get(hooks[i].channel);
				var running = hooks[i].running;

				//Run script
				if (running) {
					if (type === "js") {
						require("./../../" + path).hook(channel);
					} else if (type === "python") {
						pyHandler.run(path, "", channel);
					}
					setTimeout(update, interval);
				}
			};

			setTimeout(update, interval);
		}
	},
	changeEntry: function(name, channel, entry, value) {
		var index = -1;

		//Get index
		for (var i in hooks) {
			if (hooks[i].name === name && hooks[i][entry] !== undefined) {
				index = i;
			}
		}

		if (index === -1) {
			channel.send(name + " or " + entry + " does not exists.");
		} else {
			hooks[index][entry] = value;

			fs.writeFile("./cfg/hooks.json", JSON.stringify(hooks, null, 4), "utf-8", function (err) {
				if (err) throw err;
				channel.send("Successfully changed " + entry + " to " + value + ".\n```json\n" + JSON.stringify(hooks[index], null, 4) + "```");
			})
		}
	}
};