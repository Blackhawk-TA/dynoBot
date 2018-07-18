const base = require("path").resolve(".");

const hooks = require(base + "/src/core/utils/hooks");

module.exports = {
	run: function(msg) {
		var name = msg.contentArray[msg.contentArray.length - 1];
		hooks.changeEntry(name, msg.channel, "running", true);
	}
};