const Discord = require("discord.js");
const config = require("./cfg/config.json");
const security = require("./cfg/security.json");
const client = new Discord.Client();

//Import js modules
const testModule = require("./src/test-modules/testModule.js");

client.on("ready", () => {
	console.log("Bot successfully started.");
});

client.on("message", msg => {
	msg.content = msg.content.toLowerCase();
	if (msg.isMentioned(client.user)) {
		//Pre-edit message
		msg.content = msg.content.toLowerCase();
		msg.content = msg.content.split(" ").pop();

		testModule.testFunc(msg);

		msg.channel.send("Ok");
	}
});

client.login(security.token);