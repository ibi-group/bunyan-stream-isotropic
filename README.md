# isotropic-logger-pretty

[![npm version](https://img.shields.io/npm/v/isotropic-logger-pretty.svg)](https://www.npmjs.com/package/isotropic-logger-pretty)
[![License](https://img.shields.io/npm/l/isotropic-logger-pretty.svg)](https://github.com/ibi-group/isotropic-logger-pretty/blob/main/LICENSE)
![](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

Human-readable pretty-printer for [isotropic-logger](https://github.com/ibi-group/isotropic-logger). It turns the logger's JSON records into formatted, colorized console output with timestamps, colored log levels, and structured data, ideal for command-line tools and local development.

> This package was previously published as `bunyan-stream-isotropic`. It has been rebuilt for the pino-based isotropic-logger and renamed; `bunyan-stream-isotropic` is deprecated.

## Why Use This?

- **One-Call Setup**: A single assignment switches the shared logger to human-readable output.
- **Readable Logs**: Transforms JSON records into formatted console output that's easy to scan.
- **Colored Output**: Color-codes log levels using Node's built-in `util.styleText`, no third-party color dependency.
- **Timestamp Formatting**: Displays timestamps in a friendly `YYYY-MM-DD hh:mm:ss.SSS A` format using the Temporal API.
- **Structured Data**: Renders additional data fields with `isotropic-value-to-source`.
- **Error Details**: Special handling for error objects, including stack traces.
- **No Truncation**: Built on [isotropic-console](https://github.com/ibi-group/isotropic-console) so deep objects and long stacks are printed in full.

## Installation

```bash
npm install isotropic-logger-pretty
```

## Usage

The simplest way to use this package is to assign `outputStream` once, typically at the entry point of a command-line tool. Because isotropic-logger is a shared singleton, this affects every module that logs through it:

```javascript
import _logger from 'isotropic-logger';
import _LoggerPretty from 'isotropic-logger-pretty';

_logger.outputStream = _LoggerPretty();

// Basic logging
_logger.info('Application started');

// Logging with additional data
_logger.info({
    action: 'login',
    status: 'success',
    user: 'john'
}, 'User logged in');

// Logging errors
import _Error from 'isotropic-error';

try {
    throw _Error({
        message: 'Something went wrong'
    });
} catch (error) {
    _logger.error({
        error
    }, 'Operation failed');
}
```

## Output Format

The formatter produces log entries with the following shape:

```
[YYYY-MM-DD hh:mm:ss.SSS A] LEVEL: Message {additional data}
```

For example:

```
[2026-06-15 02:37:42.123 PM] INFO: User logged in {
    action: 'login',
    status: 'success',
    user: 'john'
}
```

Errors also display their stack traces on the following lines:

```
[2026-06-15 02:38:15.456 PM] ERROR: Operation failed {
    error: {
        message: 'Something went wrong'
    }
}
Error: Something went wrong
    at Object.<anonymous> (/app/example.js:10:11)
    ...
```

## Log Level Colors

Each log level is displayed with a different color for better visibility:

- `TRACE`: White
- `DEBUG`: Yellow
- `INFO`: Cyan
- `WARN`: Magenta
- `ERROR`: Red
- `FATAL`: Inverse (reversed foreground and background)

Custom (unrecognized) log levels are displayed in bold as `LVL <number>`.

## Data Field Serialization

Additional data fields are formatted with `isotropic-value-to-source` for consistent, readable output:

```javascript
_logger.info({
    request: {
        duration: 123,
        method: 'POST',
        path: '/api/users'
    },
    response: {
        status: 201
    }
}, 'API request processed');
```

Output:

```
[2026-06-15 02:40:23.789 PM] INFO: API request processed {
    request: {
        duration: 123,
        method: 'POST',
        path: '/api/users'
    },
    response: {
        status: 201
    }
}
```

## Migrating from bunyan-stream-isotropic

This package replaces `bunyan-stream-isotropic`. The visible output is the same, but it is wired up differently because isotropic-logger is now based on pino rather than Bunyan:

- **Enable with one assignment.** Instead of clearing `logger.streams` and calling `logger.addStream({ type: 'raw', stream })`, assign to `_logger.outputStream`.
- **No color dependency.** Coloring now uses Node's built-in `util.styleText` instead of chalk.
- **Temporal timestamps.** Timestamps are derived with the Temporal API instead of moment-timezone, with the same `YYYY-MM-DD hh:mm:ss.SSS A` format.

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/ibi-group/isotropic-logger-pretty/blob/main/CONTRIBUTING.md) for contribution guidelines.

## Issues

If you encounter any issues, please file them at https://github.com/ibi-group/isotropic-logger-pretty/issues
