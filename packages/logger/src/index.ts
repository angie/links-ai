import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
});

// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
if (process.env.SST_APP !== "prod") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
} else {
  logger.add(
    new transports.Console({
      format: format.json(),
    }),
  );
}
