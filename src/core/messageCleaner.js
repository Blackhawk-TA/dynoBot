const config = require("./../../cfg/config");

module.exports = {
	run: function (msg, client) {
		msg.channel.fetchMessages({limit: config.messageCleaner.amount})
			.then(messages => {
				var msgArray = messages.array();
				var msgToDelete = [];
				var index = 0;

				for (var i in msgArray) {
					if (msgArray[i].isMentioned(client.user) || msgArray[i].author.id === client.user.id) {
						msgToDelete[index] = msgArray[i];
						index++;
					}
				}

				msg.channel.bulkDelete(msgToDelete);
				msg.channel.send(`I've deleted ${messages.size} messages related to request regarding me.`);
			})
			.catch(console.error);
	}
};