/**
 * logger — Winston-backed logging for the TTACart framework.
 *
 * Two ways to use it:
 *   - `logger`              -> the shared root logger (framework-wide messages)
 *   - `createLogger(scope)` -> a child logger tagged with a scope label, so
 *                              every line shows WHERE it came from. Page Objects
 *                              pass their class name as the scope, e.g.
 *                              `createLogger('LoginPage')`.
 *
 * Level is driven by the LOG_LEVEL env var (default 'info'). Output goes to the
 * console (pretty, colourised) and to `logs/combined.log` (plain text) so CI
 * runs leave an artifact behind.
 */

// Import the winston library which provides logging capabilities.
import winston from 'winston';

// Destructure winston.format to get helper functions for formatting log lines.
// combine    -> chains multiple formatters together.
// timestamp  -> adds date+time to each log entry.
// printf     -> custom string template for each log line.
// colorize   -> adds colours (e.g., green info, red error) to console output.
// errors     -> ensures error stack traces are included in the log.
const { combine, timestamp, printf, colorize, errors } = winston.format;

// Read the LOG_LEVEL from environment variables (set in .env file).
// If LOG_LEVEL is not defined, fallback to 'info' as the default level.
const LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';

/** `2026-06-02 07:40:01 [info] [LoginPage] clicked #login-button` */
// Define a custom format that prints one log line with timestamp, level, optional scope tag, and the message.
const lineFormat = printf(({ level, message, timestamp: ts, scope }) => {
    // If a scope was provided (like 'LoginPage'), wrap it in brackets; otherwise leave it empty.
    const tag = scope ? ` [${scope as string}]` : '';
    // Build the final string: date-time [level][scope] message
    return `${ts as string} [${level}]${tag} ${message as string}`;
});

// Create the main (root) logger instance that everything else will use.
export const logger = winston.createLogger({
    // Only log messages at this level or higher (e.g., info, warn, error).
    level: LOG_LEVEL,

    // Combine multiple formatters into a single pipeline.
    format: combine(
        // Make sure error stack traces are captured in the log output.
        errors({ stack: true }),
        // Add a timestamp to every log entry in YYYY-MM-DD HH:mm:ss format.
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // Apply the custom lineFormat defined above so each entry looks consistent.
        lineFormat,
    ),

    // Define where the logs should be sent (transports).
    transports: [
        // Console transport: prints logs to the terminal.
        new winston.transports.Console({
            format: combine(
                // Add colours to the log level (info=green, warn=yellow, error=red) for better readability.
                colorize({ level: true }),
                // Add timestamp again specifically for the console output.
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                // Apply the same custom line format so console output matches file output.
                lineFormat,
            ),
        }),
        // File transport: writes logs to a file so they can be reviewed later (especially in CI).
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

/**
 * Build a scoped child logger. Every line it emits carries the `scope` label.
 * Use the calling class name as the scope.
 */
// Export a helper function that creates a child logger tagged with a specific scope name.
export function createLogger(scope: string): winston.Logger {
    // logger.child() creates a derived logger that automatically includes { scope } in every log entry.
    return logger.child({ scope });
}

// Export the Logger type from winston so other files can type their log variables easily.
export type Logger = winston.Logger;

// Export the root logger as the default export so it can be imported conveniently.
export default logger;
