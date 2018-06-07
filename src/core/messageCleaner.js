const configHandler = require("./configHandler");
const twoWeeks = 14; //in days
const oneDay = 86400000; //in ms

module.exports = {
	run: function (msg, client) {
		var amount = configHandler.readJSON("config", msg.guild.id, "settings", "messageCleanAmount");

		msg.channel.fetchMessages({limit: amount})
			.then(messages => {
				var msgArray = messages.array();
				var msgToDelete = [];
				var index = 0;
				var date = new Date();

				for (var i in msgArray) { //TODO optimize
					var diffDays = Math.round(Math.abs((msgArray[i].createdAt.getTime() - date.getTime()) / (oneDay)));
					if ((msgArray[i].isMentioned(client.user) || msgArray[i].author.id === client.user.id) && diffDays < twoWeeks) {
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