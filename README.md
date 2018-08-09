# dynoBot (WIP)
Modular Discord bot running in JavaScript and Python.

### What commands does the bot have?
You can see all available commands by typing "@BotName help" in the discord chat. Alternatively you can take a look at the [commands.json](https://github.com/Blackhawk-TA/dynoBot/blob/master/cfg/commands.json) file.

### How can I use the bot for my own discord server?
It's quite simple, first of all you need nodejs and optinally python3 if you want to use python modules.
After the installation, clone this repository and run `npm install` within the `dynoBot` folder. It should install all required dependencies. 

Once that's done, you'll have to add the `security.json` file within the directory `dynoBot/cfg`.
It should look like this: 
```json
{
	"token": "your discord bot token"
}
```
Now you can start the bot by using the command `node main.js` within the directory `dynoBot`.
