module.exports = {
	run: function(msg) {
		msg.channel.send("I received these parameters: " + msg.contentArray);
	}
};