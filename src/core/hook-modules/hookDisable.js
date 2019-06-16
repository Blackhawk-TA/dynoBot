const base = require("path").resolve(".");

const hooks = require(base + "/src/core/utils/hooks");

module.exports = {
	run: function(msg) {
		let name = msg.getContentArray()[msg.getContentArray().length - 1];
		hooks.changeEntry(name, msg.channel, "running", false);
	}
};