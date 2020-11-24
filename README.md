# dynoBot
[![license](http://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Blackhawk-TA/dynoBot/blob/master/LICENSE.md)
[![build](https://github.com/Blackhawk-TA/dynoBot/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/Blackhawk-TA/dynoBot/actions)
[![github](https://img.shields.io/github/release/Blackhawk-TA/dynoBot.svg?color=brightgreen)](https://github.com/Blackhawk-TA/dynoBot/releases)
[![github](https://img.shields.io/github/package-json/v/Blackhawk-TA/dynoBot.svg?color=brightgreen)](https://github.com/Blackhawk-TA/dynoBot/tree/master)


### Overview
1. [What is dynoBot](#what-is-dynobot)
2. [Features](#features)
3. [Chat commands](#what-commands-does-the-bot-have)
4. [How to use](#how-can-i-use-the-bot-for-my-own-discord-server)
5. [Creating new modules](#how-can-i-create-new-modules)
	1. [Chat modules](#chat-module)
		1. [JavaScript](#javascript-chat-module)
		2. [Python](#python-chat-module)
		3. [Lua](#lua-chat-module)
	2. [Hook modules](#hook-module)
		1. [JavaScript](#javascript-hook-module)
		2. [Python](#python-hook-module)
		3. [Lua](#lua-hook-module)
6. [Contribute](#can-i-create-pull-request-with-new-modules)

### What is dynoBot?
dynoBot is a modular Discord bot using JavaScript and optionally also Python and Lua.
It is built in a way that creating new modules can be done with ease in a scripting language you prefer.

The idea behind the bot is to create the modules you need by yourself with a minimum amount of effort.
Therefore, dynoBot can be considered as a framework which handles everything related to the discord api, so you can immediately start developing your own modules.

Nevertheless, dynoBot can be used without writing a single line of code as long as the included modules are all you need.

### Features
The bot has currently following modules:
- music bot with Spotify, Apple Music and YouTube playlist support
- remote control rcon game servers
- currency conversion
- WolframAlpha calculations

### What commands does the bot have?
You can see all available commands by typing "@BotName help" in the discord chat.
Alternatively you can take a look at the [commands.json](https://github.com/Blackhawk-TA/dynoBot/blob/master/cfg/commands.json) file.

### How can I use the bot for my own discord server?
It's quite simple, first of all you need nodejs and optionally python3 for python modules and lua for lua modules.
After the installation, clone this repository and run `npm install` within the `dynoBot` folder. It should install all required dependencies.

Once that's done, you'll have to add the `security.json` file within the directory `dynoBot/cfg`.
It should look like this:
```json
{
	"token": "your discord bot token"
}
```

**IMPORTANT: When you fork this project, don't upload the security.json to your repository. This would allow others to steal your discord token.**


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
You can create modules in JavaScript, Python or Lua. There are two types of modules, a chat module and a hook module.
A chat module is executed every time a user sends a message with the corresponding command.
A hook is automatically executed in a specific interval. Below I will show you how to create them in JavaScript, Python and Lua.
Alternatively you can take a look at the example modules for JavaScript, Python and Lua included in the project.

#### Chat module:
JavaScript, Python and Lua modules need an entry in the commands.json file looking like this:
```json
{
    "group": "command-group-name",
    "type": "python",
    "regex": "py-example|python example",
    "help": "python example",
    "path": "src/py-modules/example-python.py",
    "hidden": false
}
```
The content of the help property will be used for the command list. If it does not exist, the regex property will be used.

The group property can be used to allow filtering while using the help command.
For example there is a group called "basic" including all built-in core commands.
If you want to see only commands of the "basic" group in the command list, use "<group-name> help" instead of the normal help command.

Setting hidden to true will exclude the command from the command list.

##### JavaScript chat module
The JavaScript module has direct access to the [discord.js wrapper](https://discord.js.org).
The base structure of a module looks like this:
```js
module.exports = {
	run: function(msg, client) {
		msg.getTextChannel().send("I received these parameters: " + msg.getContentArray());
	}
};
```
The code executed when the module is called belongs into the run function.
The parameters msg and client are by the [chatbot-api-wrapper](https://github.com/Blackhawk-TA/chatbot-api-wrapper).
You can find further information about the implementation there.

##### Python chat module
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

##### Lua chat module
The Lua module has also no access to the [discord.js wrapper](https://discord.js.org) but gets the `msg.contentArray` and `msg.aRegexGroups`.
The base structure looks like this:
```lua
-- Import lua module helper for splitting strings into arrays
require "src/utils/luaUtils"

local sMessage = arg[1] -- String of input parameters
local sRegexGroups = arg[2] -- String of input regex groups

local aMessage = utils.splitString(sMessage, ",") -- Array of input parameters
local aRegexGroups = utils.splitString(sRegexGroups, ",") -- Array of input regex groups

-- Insert code to handle the input parameters here

--This will be the msg that the bot sends
print("I received these parameters: [" .. tostring(aMessage[1]) .. ", " .. tostring(aMessage[2]) .. "]")

--This is a second message that the bot sends
print("These are the regex groups: [" .. tostring(aRegexGroups[1]) .. "]")
```
As you can see, the print makes the bot send a message.
Overall Lua modules are pretty similar to Python modules.

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

##### JavaScript hook module
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

##### Python hook module
The Python module has no access to the channel object, it receives no inputs.
It just runs the python script and every call of print creates a bot message. It should look like this:

```python
import sys

# insert code to handle the input parameters here

# This will be the msg that the bot sends
print("This py message is automatically sent in a specific interval")
sys.stdout.flush()  # cleanup
```

##### Lua hook module
The Lua module has also no access to the channel object, it receives no inputs.
It just runs the lua script and every call of print creates a bot message. It should look like this:

```lua
-- Insert code here

-- This will be the msg that the bot sends
print("This lua message is automatically sent in a specific interval.")
```
This is again similar to Python modules.

### Can I create pull request with new modules?
Yes, I will review your code and if it's good, I'll merge it into the master.
Please adapt your code style regarding already existing modules.

### Can I develop the bot without sharing my modules?
Yes, that's also ok. But it would be nice if more people could profit from your work.
