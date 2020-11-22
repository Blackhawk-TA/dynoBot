module.exports = {
	/**
	 * Will be removed in version 1.3.1
	 * @deprecated
	 */
	run: function(msg) {
		msg.getTextChannel().send("This command is not needed anymore. Just add a title or playlist instead.");
	}
};
