const base = require("path").resolve(".");
const configHandler = require(base + "/src/utils/configHandler");

const twoWeeks = 14; //in days
const oneDay = 86400000; //in ms

module.exports = {
	run: function (msg, client) {
		let pathConfig = base + "/cfg/config.json";
		let amount = configHandler.readJSON(pathConfig, msg.getServer().getId(), "message_cleaner", "amount");

		msg.getTextChannel().getMessages(amount).then(messages => {
			let msgToDelete = [];
			let date = new Date();

			messages.forEach(message => {
				let diffDays = Math.round(Math.abs((message.getCreationDate().getTime() - date.getTime()) / (oneDay)));
				if ((message.isMentioned(client.getUser()) || message.getAuthor().getId() === client.getUser().getId()) && diffDays < twoWeeks && msg.isDeletable()) {
					msgToDelete.push(message);
				}
			});

			msg.getTextChannel().deleteMessages(msgToDelete);
			msg.getTextChannel().send(`I've deleted ${msgToDelete.length} messages related to requests regarding me.`);
		}).catch(err => {
			console.error(`${new Date().toLocaleString()}: ${err}`);
		});
	}
};
