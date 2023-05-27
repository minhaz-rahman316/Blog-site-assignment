const winston = require('winston');

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    //
    // - Write logs with an importance level of `error` or lower to the `blogerror.log` file
    // - Write logs with an importance level of `info` or lower to the `blogcombined.log` file
    //

    new winston.transports.File({ filename: "blogerror.log", level: "error" }),
    new winston.transports.File({ filename: "blogcombined.log" }),
  ],
});
module.exports = logger;