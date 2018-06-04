'use strict';

const pyHandler = require("./../pythonHandler");

class HookUpdater {
	constructor(hooks, item, interval, channels) {
		this.hooks = hooks;
		this.item = item;
		this.interval = interval;
		this.channels = channels;
	}

	update() {
		var i = this.item;
		var type = this.hooks[i].type;
		var path = this.hooks[i].path;
		var interval = this.hooks[i].interval;
		var channel = this.channels.get(this.hooks[i].channel);
		var running = this.hooks[i].running;

		//Run script
		if (running) {
			if (type === "js") {
				require("./../../../" + path).hook(channel);
			} else if (type === "python") {
				pyHandler.run(path, "", channel);
			}
			setTimeout(this.update(), interval);
		}
	}
}

module.exports = HookUpdater;