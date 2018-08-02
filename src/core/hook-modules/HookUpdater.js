const base = require("path").resolve(".");

const pyHandler = require(base + "/src/core/utils/pythonHandler");
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
		var configHandler = require(base + "/src/utils/configHandler");
		var pathConfig = base + "/cfg/hooks.json";

		//Non-editable
		var type = hooks[this.id].type;
		var path = hooks[this.id].path;

		//Editable
		var channelId = configHandler.readJSON(pathConfig, this.server.id, this.id, "channel");
		this.interval = configHandler.readJSON(pathConfig, this.server.id, this.id, "interval");
		var running = configHandler.readJSON(pathConfig, this.server.id, this.id, "running");
		var channel = this.server.channels.get(channelId);

		//Run script
		if (running) {
			try {
				if (channel !== undefined) {
					if (type === "js") {
						require("./../../../" + path).hook(channel);
					} else if (type === "python") {
						pyHandler.run(path, "", channel);
					}
					console.log(`${new Date().toLocaleString()}: Executed hook job.`);
				}
			} catch(e) {
				console.error(e);
			}
			setTimeout(() => {
				this.nextCall();
			}, this.interval);
		}
	}
}

module.exports = HookUpdater;