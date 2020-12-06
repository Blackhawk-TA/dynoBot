const {createLogger, format, transports} = require("winston");

let logger = createLogger({
	level: "info",
	format: format.combine(
		format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss"
		}),
		format.errors({stack: true}),
		format.splat(),
		format.prettyPrint()
	),
	transports: [
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.simple()
			)
		})
	]
});

module.exports = logger;
