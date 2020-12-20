const {createLogger, format, transports} = require("winston");

const base = require("path").resolve(".");
const security = require(base + "/cfg/security.json");

let logger = createLogger({
	level: "info",
	format: format.combine(
		format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss"
		}),
		format.errors({stack: true}),
		format.splat(),
		format.prettyPrint()
	)
});

if (security.logging) {
	logger.add(new transports.File({filename: "error.log", level: "error"}));
	logger.add(new transports.File({filename: "combined.log"}));
} else {
	logger.add(new transports.Console({
		format: format.combine(
			format.colorize(),
			format.simple()
		)
	}));
}

module.exports = logger;
