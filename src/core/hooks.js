const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");
const HookUpdater = require(base + "/src/core/hook-modules/HookUpdater");
const hooks = require(base + "/cfg/hooks.json");

module.exports = {
	init: function(server) {
		for (var id in hooks) {
			if (configHandler.readJSON(base + "/cfg/hooks.json", server.id, id, "running")) {
				var interval = configHandler.readJSON(base + "/cfg/hooks.json", server.id, id, "interval");

				const hookUpdater = new HookUpdater(id, interval, server);
				setTimeout(() => {
					hookUpdater.nextCall()
				}, interval);
			}
		}
	},
	changeEntry: function(name, channel, entry, value) {
		var index = -1;

		//Get index
		for (var id in hooks) {
			if (hooks[id].name === name && hooks[id][entry] !== undefined) {
				index = id;
			}
		}

		if (index === -1) {
			channel.send("Sorry, but " + name + " or " + entry + " is an invalid parameter.");
		} else {
			configHandler.editJSON(channel, base + "/cfg/hooks.json", index, entry, value)
		}
	}
};