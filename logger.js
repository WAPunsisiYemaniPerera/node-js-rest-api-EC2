import winston from "winston";

// Set up Winston logger
const logger = winston.createLogger({
  level: "info", // Set the log level you want
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }), // Ensure this is correct
  ],
});

export default logger;
