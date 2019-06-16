const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");

const twoWeeks = 14; //in days
const oneDay = 86400000; //in ms

module.exports = {
	run: function (msg, client) {
		let pathConfig = base + "/cfg/config.json";
		let amount = configHandler.readJSON(pathConfig, msg.getServer().getId(), "message_cleaner", "amount");

		msg.channel.getMessages(amount)
			.then(messages => {
				let msgToDelete = [];
				let date = new Date();

				messages.forEach(message => { //TODO optimize
					let diffDays = Math.round(Math.abs((message.getCreationDate().getTime() - date.getTime()) / (oneDay)));
					if ((message.isMentioned(client.user) || message.getAuthor().getId() === client.user.getId()) && diffDays < twoWeeks && msg.isDeletable()) {
						msgToDelete.push(message);
					}
				});

				msg.channel.deleteMessageArray(msgToDelete);
				msg.channel.send(`I've deleted ${msgToDelete.length} messages related to requests regarding me.`);
			})
			.catch((e) => {
				console.error(`${new Date().toLocaleString()}: ${e}`)
			});
	}
};