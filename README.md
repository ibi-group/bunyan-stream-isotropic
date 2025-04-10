# bunyan-stream-isotropic

[![npm version](https://img.shields.io/npm/v/bunyan-stream-isotropic.svg)](https://www.npmjs.com/package/bunyan-stream-isotropic)
[![License](https://img.shields.io/npm/l/bunyan-stream-isotropic.svg)](https://github.com/ibi-group/bunyan-stream-isotropic/blob/main/LICENSE)
![](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

A Bunyan stream that produces formatted, human-readable console output with timestamps, colored log levels, and structured data.

## Why Use This?

- **Human-Readable Logs**: Transforms Bunyan's JSON logs into formatted console output that's easy to read
- **Colored Output**: Uses chalk to color-code log levels for better visibility (trace, debug, info, warn, error, fatal)
- **Timestamp Formatting**: Displays timestamps in a human-friendly format
- **Structured Data**: Preserves and displays additional data fields in a readable format
- **Error Details**: Special handling for error objects with stack traces
- **Direct Integration**: Works seamlessly with isotropic-logger

## Installation

```bash
npm install bunyan-stream-isotropic
```

## Usage

```javascript
import _Bunyan from 'bunyan';
import _bunyanStreamIsotropic from 'bunyan-stream-isotropic';

// Create a new logger with the isotropic stream
const _logger = _Bunyan.createLogger({
    name: 'myapp',
    streams: [{
        level: 'info',
        stream: _bunyanStreamIsotropic,
        type: 'raw'
    }]
});

// Basic logging
_logger.info('Application started');

// Logging with additional data
_logger.info({
    action: 'login',
    status: 'success',
    user: 'john'
}, 'User logged in');

// Logging errors
try {
    // Some code that might throw
    throw new Error('Something went wrong');
} catch (error) {
    _logger.error({
        error
    }, 'Operation failed');
}
```

## Integration with isotropic-logger

The `bunyan-stream-isotropic` module is designed to work seamlessly with `isotropic-logger`:

```javascript
import _bunyanStreamIsotropic from 'bunyan-stream-isotropic';
import _logger from 'isotropic-logger';

// Replace the default streams with the isotropic stream
_logger.streams = [];
_logger.addStream({
    level: 'info',
    stream: _bunyanStreamIsotropic,
    type: 'raw'
});

// Now logs will use the formatted output
_logger.info('This message will be formatted for human readability');
```

## Output Format

The stream produces log entries with the following format:

```
[YYYY-MM-DD hh:mm:ss.SSS A] LEVEL: Message {additional data}
```

For example:

```
[2023-06-15 02:37:42.123 PM] INFO: User logged in {
    action: 'login',
    status: 'success',
    user: 'john'
}
```

Errors will also display their stack traces:

```
[2023-06-15 02:38:15.456 PM] ERROR: Operation failed {
    error: {
        message: 'Something went wrong'
    }
}
Error: Something went wrong
    at Object.<anonymous> (/app/example.js:10:11)
    at Module._compile (internal/modules/cjs/loader.js:1085:14)
    ...
```

## Log Level Colors

Each log level is displayed with a different color for better visibility:

- `TRACE`: White
- `DEBUG`: Yellow
- `INFO`: Cyan
- `WARN`: Magenta
- `ERROR`: Red
- `FATAL`: Inverse (white background, black text)

Custom log levels will be displayed in bold with their level number.

## Features

### Timestamped Logs

All logs include a timestamp in the format `YYYY-MM-DD hh:mm:ss.SSS A` (e.g., `2023-06-15 02:37:42.123 PM`).

### Formatted Error Handling

The stream provides special handling for error objects:

- Displays error message, code, name, and signal if available
- Properly formats error stack traces
- Includes additional error details

### Data Field Serialization

Additional data fields are formatted using `isotropic-value-to-source` for consistent, readable output:

```javascript
_logger.info({
    request: {
        method: 'POST',
        path: '/api/users',
        duration: 123
    },
    response: {
        status: 201
    }
}, 'API request processed');
```

Output:

```
[2023-06-15 02:40:23.789 PM] INFO: API request processed {
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

## Configuration

The stream doesn't require configuration but works with Bunyan's built-in configuration options:

```javascript
// Use with a specific log level
_logger.addStream({
    level: 'info', // Only show info and above
    stream: _bunyanStreamIsotropic,
    type: 'raw'
});

// Multiple streams with different levels
_logger.addStream({
    level: 'error',
    stream: _bunyanStreamIsotropic,
    type: 'raw'
});

_logger.addStream({
    level: 'info',
    stream: process.stdout
});
```

## Compatibility

- Works with Node.js v14 and above
- Compatible with all Bunyan versions

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/ibi-group/bunyan-stream-isotropic/blob/main/CONTRIBUTING.md) for contribution guidelines.

## Issues

If you encounter any issues, please file them at https://github.com/ibi-group/bunyan-stream-isotropic/issues
