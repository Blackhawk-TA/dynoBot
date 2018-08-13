# dynoBot

### What is dynoBot?
dynoBot is a modular Discord bot using JavaScript and Python.

### What commands does the bot have?
You can see all available commands by typing "@BotName help" in the discord chat.
Alternatively you can take a look at the [commands.json](https://github.com/Blackhawk-TA/dynoBot/blob/master/cfg/commands.json) file.

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
If you want to use the Wolfram|Alpha module, you'll need their API key in the security.json as well.
You can request a free Wolfram|Alpha API key [here](https://products.wolframalpha.com/api/).

With the API key, your security.json should look like this:
```json
{
	"token": "your discord bot token",
	"wolframAlphaAPI": "your api key"
}
```

Now you can start the bot by using the command `node main.js` within the directory `dynoBot`.

### How can I create new modules?
You can create modules in JavaScript or Python. There are two types of modules, a chat module and a hook module.
A chat module is executed every time a user sends a message with the corresponding command.
A hook is automatically executed in a specific interval. Below I will show you how to create them in JavaScript and Python.
Alternatively you can take a look at the example modules for JavaScript and Python included in the project.

#### Chat module:
JavaScript and Python modules both need an entry in the commands.json file looking like this:
```json
{
    "type": "python",
    "regex": "py-example|python example",
    "path": "src/py-modules/example-python.py"
}
```
##### JavaScript
The JavaScript module has direct access to the [discord.js wrapper](https://discord.js.org).
The base structure of a module looks like this:
```js
module.exports = {
	run: function(msg, client) {
		msg.channel.send("I received these parameters: " + msg.contentArray);
	}
};
```
The code executed when the module is called belongs into the run function.
The parameter msg is the message object from the discord wrapper ([see documentation](https://discord.js.org)).
It has two additions to it: `msg.contentArray` which has a chat message split up as an array,
                            `msg.aRegexGroups` which has the regex groups from the chat message as an array

##### Python
The Python module has no access to the [discord.js wrapper](https://discord.js.org) but gets the `msg.contentArray` and `msg.aRegexGroups`.
The base structure looks like this:
```python
import sys

msg = sys.argv[1].split(",")  # Array of input parameters
regexGroups = sys.argv[2].split(",")  # Array of input regex groups

# insert code to handle the input parameters here

print("I received these parameters: " + str(msg))  # This will be the msg that the bot sends
print("These are the regex groups" + str(regexGroups))  # This is a second message that the bot sends
sys.stdout.flush()  # cleanup
```
As you can see, the print makes the bot send a message.

#### Hook module:
JavaScript and Python modules both need an entry in the hooks.json file looking like this:
```json
"technicalHookName": {
    "type": "js",
    "name": "hookName",
    "path": "src/js-modules/yourModule.js",
    "channel": 0,
    "interval": 10000,
    "running": false
}
```

##### JavaScript
The JavaScript module has access to the channel object of the [discord.js wrapper](https://discord.js.org).
The code executed when the module is called belongs into the hook function.

```js
module.exports = {
	hook: function(channel) {
		channel.send("This js message is automatically sent in a specific interval");
	}
};
```

The hook function is executed when the hooks.json has the an existing channel and is running.

##### Python
The Python module has no access to the channel object, it receives no inputs.
It just runs the python script and every call of print creates a bot message. It should look like this:

```python
import sys

# insert code to handle the input parameters here

# This will be the msg that the bot sends
print("This py message is automatically sent in a specific interval")
sys.stdout.flush()  # cleanup
```

### Can I create pull request with new modules?
Yes, I will review your code and if it's good, I'll merge it into the master.
Please adapt your code style regarding already existing modules.

### Can I develop the bot without sharing my modules?
Yes, that's also ok. But it would be nice if more people could profit from your work.
