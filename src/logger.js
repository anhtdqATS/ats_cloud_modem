const winston = require('winston');
const expressWinston = require('express-winston');

// config logger
const logger = winston.createLogger({
  level: 'error', // log level
  format: winston.format.json(), // format log
  transports: [
    new winston.transports.Console(), // write console
    new winston.transports.File({ filename: 'logs/app.log' }), // write file
  ],
});

const requestLogger = expressWinston.logger({
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'http.log' })],
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  meta: false, // no save metadata
  msg: 'HTTP {{req.method}} {{req.url}}', // format log
  expressFormat: true, //
  colorize: true, // color console
  ignoreRoute: (req, res) => false, // hide route  ghi log
});

module.exports = { logger, requestLogger };
