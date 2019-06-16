const base = require("path").resolve(".");

const hooks = require(base + "/src/core/utils/hooks");

module.exports = {
	run: function(msg) {
		let name = msg.getContentArray()[msg.getContentArray().length - 3];
		let channelId = msg.getContentArray()[msg.getContentArray().length - 1];

		if (msg.getServer().getChannels().get(channelId) !== undefined) { //TODO check if it works
			hooks.changeEntry(name, msg.channel, "channel", channelId);
		} else {
			msg.channel.send("Sorry, but a channel with the id " + channelId + " does not exist on this server.");
		}
	}
};