const pyHandler = require("./../pythonHandler");
const hooks = require("./../../../cfg/hooks.json");

class HookUpdater {
	constructor(id, interval, channels) {
		this.id = id;
		this.interval = interval;
		this.channels = channels;
	}
	update() {
		var type = hooks[this.id].type;
		var path = hooks[this.id].path;
		this.interval = hooks[this.id].interval;
		var channel = this.channels.get(hooks[this.id].channel);
		var running = hooks[this.id].running;

		//Run script
		if (running) {
			if (type === "js") {
				require("./../../../" + path).hook(channel);
			} else if (type === "python") {
				pyHandler.run(path, "", channel);
			}
			setTimeout(() => {
				this.update();
			}, this.interval)
		}
	}
}

module.exports = HookUpdater;