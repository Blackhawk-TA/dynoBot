const base = require("path").resolve(".");

const hooks = require(base + "/src/core/utils/hooks");

module.exports = {
	run: function(msg) {
		var name = msg.contentArray[msg.contentArray.length - 3];
		var interval = msg.contentArray[msg.contentArray.length - 1];

		if (isFinite(interval * 60000) && interval > 0) {
			hooks.changeEntry(name, msg.channel, "interval", interval * 60000);
		} else {
			msg.channel.send(interval + " is not allowed as interval.")
		}
	}
};