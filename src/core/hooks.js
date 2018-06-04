const fs = require("fs");

const configHandler = require("./configHandler");
const HookUpdater = require("./hook-modules/HookUpdater");

const hooks = require("./../../cfg/hooks.json");

module.exports = {
	init: function(channels) {
		for (var i in hooks) {
			var interval = hooks[i].interval;

			//TODO maybe as module instead of class
			//Error because hooks is too big for class stack
			const hookUpdater = new HookUpdater(hooks, i, interval, channels);
			setTimeout(hookUpdater.update(), interval);
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
			configHandler.editHooks(channel.guild.id, index, entry, value)
		}
	}
};