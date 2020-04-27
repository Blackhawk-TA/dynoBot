const base = require("path").resolve(".");

const hooks = require(base + "/src/core/utils/hooks");

module.exports = {
	run: function(msg) {
		let contentArray = msg.getContentArray(true),
			name = contentArray[contentArray.length - 3],
			interval = contentArray[contentArray.length - 1];

		if (isFinite(interval * 60000) && interval > 0) {
			hooks.changeEntry(name, msg.getTextChannel(), "interval", interval * 60000);
		} else {
			msg.getTextChannel().send(interval + " is not allowed as interval.");
		}
	}
};
