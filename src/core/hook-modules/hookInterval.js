const base = require("path").resolve(".");

const hooks = require(base + "/src/core/utils/hooks");

module.exports = {
	run: function(msg) {
		let name = msg.getContentArray()[msg.getContentArray().length - 3];
		let interval = msg.getContentArray()[msg.getContentArray().length - 1];

		if (isFinite(interval * 60000) && interval > 0) {
			hooks.changeEntry(name, msg.channel, "interval", interval * 60000);
		} else {
			msg.channel.send(interval + " is not allowed as interval.")
		}
	}
};