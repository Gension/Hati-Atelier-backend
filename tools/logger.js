// il faut importer winston
const { createLogger, format, transports } = require('winston');
const path = require('path');

console.log(path.join(__basedir, '/logs/logs.txt' ));
const logger = createLogger({
  level: 'info',
  format: format.json(),
  defaultMeta: { service: 'machette-api' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new transports.File({ filename: path.join(__basedir, '/logs/logs.txt' )}),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

module.exports = logger;

// logger.log('info', 'Hello distributed log files!');