const base = require("path").resolve(".");

const hooks = require(base + "/src/core/utils/hooks");

module.exports = {
	run: function(msg) {
		let contentArray = msg.getContentArray(true),
			name = contentArray[contentArray.length - 3],
			channelId = contentArray[contentArray.length - 1];

		if (msg.getServer().hasChannel(channelId)) { //TODO check if it works
			hooks.changeEntry(name, msg.getChannel(), "channel", channelId);
		} else {
			msg.getChannel().send("Sorry, but a channel with the id " + channelId + " does not exist on this server.");
		}
	}
};