const base = require("path").resolve(".");
const hooks = require(base + "/src/core/utils/hooks");

module.exports = {
	run: function(msg) {
		let contentArray = msg.getContentArray(true),
			name = contentArray[contentArray.length - 1],
			stateName = contentArray[contentArray.length - 2],
			state = stateName === "enable";

		hooks.changeEntry(name, msg.getTextChannel(), "running", state);
	}
};
