const base = require("path").resolve(".");

const languageHandler = require(base + "/src/core/utils/languageHandler");
const hooks = require(base + "/cfg/hooks.json");

class HookUpdater {
	constructor(id, interval, server) {
		this.id = id;
		this.interval = interval;
		this.server = server;
	}

	/**
	 * Calls the hook and and schedules the next call
	 */
	nextCall() {
		let configHandler = require(base + "/src/utils/configHandler");
		let pathConfig = base + "/cfg/hooks.json";

		//Non-editable
		let type = hooks[this.id].type;
		let path = hooks[this.id].path;

		//Editable
		let channelId = configHandler.readJSON(pathConfig, this.server.getId(), this.id, "channel");
		this.interval = configHandler.readJSON(pathConfig, this.server.getId(), this.id, "interval");
		let running = configHandler.readJSON(pathConfig, this.server.getId(), this.id, "running");
		let channel = this.server.hasChannel(channelId);

		//Run script
		if (running) {
			try {
				if (channel !== undefined) {
					switch (type) {
						case "js":
							require("./../../../" + path).hook(channel);
							break;
						case "python":
							languageHandler.runScript("python", path, "", "", channel);
							break;
						case "lua":
							languageHandler.runScript("lua", path, "", "", channel);
							break;
						default:
							break;
					}
					console.log(`${new Date().toLocaleString()}: Executed hook job.`);
				}
			} catch (err) {
				console.error(`${new Date().toLocaleString()}: ${err}`);
			}
			setTimeout(() => {
				this.nextCall();
			}, this.interval);
		}
	}
}

module.exports = HookUpdater;
