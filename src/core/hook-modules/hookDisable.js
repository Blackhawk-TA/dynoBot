const hooks = require("./../hooks");

module.exports = {
	run: function(msg) {
		var name = msg.contentArray[msg.contentArray.length - 1];
		hooks.changeEntry(name, msg.channel, "running", false);
	}
};