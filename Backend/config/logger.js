// This file configures the logger for the application using Winston.
// It sets up file transports for error and combined logs, and a console transport for development.
const winston = require('winston');
const path = require('path');

const logConfiguration = {
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/combined.log'),
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
};

if (process.env.NODE_ENV !== 'production') {
    logConfiguration.transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    );
}

const logger = winston.createLogger(logConfiguration);

module.exports = logger;