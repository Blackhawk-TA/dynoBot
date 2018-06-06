const configHandler = require("./configHandler");
const twoWeeks = 1209600000; //in ms

module.exports = {
	run: function (msg, client) {
		var amount = configHandler.readJSON("config", msg.guild.id, "messageCleanAmount");

		msg.channel.fetchMessages({limit: amount})
			.then(messages => {
				var msgArray = messages.array();
				var msgToDelete = [];
				var index = 0;

				for (var i in msgArray) {
					if ((msgArray[i].isMentioned(client.user) || msgArray[i].author.id === client.user.id) && msgArray[i].createdTimestamp < twoWeeks) {
						msgToDelete[index] = msgArray[i];
						index++;
					}
				}

				msg.channel.bulkDelete(msgToDelete);
				msg.channel.send(`I've deleted ${msgToDelete.length} messages related to request regarding me.`);
			})
			.catch(console.error);
	}
};