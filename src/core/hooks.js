const configHandler = require("./configHandler");
const HookUpdater = require("./hook-modules/HookUpdater");
const hooks = require("./../../cfg/hooks.json");

module.exports = {
	init: function(server) {
		for (var i in hooks) {
			var interval = hooks[i].interval;

			const hookUpdater = new HookUpdater(i, interval, server);
			setTimeout(() => {
				hookUpdater.nextCall()
			}, interval);
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
			channel.send("Sorry, but " + name + " or " + entry + " is an invalid parameter.");
		} else {
			configHandler.editJSON(channel, "hooks", index, entry, value)
		}
	}
};