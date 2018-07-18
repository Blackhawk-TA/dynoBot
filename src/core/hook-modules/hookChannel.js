const base = require("path").resolve(".");

const hooks = require(base + "/src/core/utils/hooks");

module.exports = {
	run: function(msg) {
		var name = msg.contentArray[msg.contentArray.length - 3];
		var channelId = msg.contentArray[msg.contentArray.length - 1];

		if (msg.guild.channels.get(channelId) !== undefined) {
			hooks.changeEntry(name, msg.channel, "channel", channelId);
		} else {
			msg.channel.send("Sorry, but a channel with the id " + channelId + " does not exist on this server.");
		}
	}
};