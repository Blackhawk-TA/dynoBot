const base = require("path").resolve(".");

const hooks = require(base + "/src/core/utils/hooks");

module.exports = {
	run: function(msg) {
		let name = msg.getContentArray(true)[msg.getContentArray(true).length - 1];
		hooks.changeEntry(name, msg.getChannel(), "running", true);
	}
};