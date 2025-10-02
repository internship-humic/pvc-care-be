import winston from "winston";
import chalk from "chalk";

const customFormat = winston.format.printf(({ timestamp, level, message }) => {
  let msg = message;
  if (level === "warn") {
    msg = chalk.yellow(message);
  } else if (level === "error") {
    msg = chalk.red(message);
  } else if (level === "info") {
    msg = chalk.green(message);
  }
  return `[${timestamp}] ${level.toUpperCase()}: ${msg}`;
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YYYY hh:mm:ss A" }),
    customFormat
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
