import _console from 'isotropic-console';
import _make from 'isotropic-make';
import _stream from 'node:stream';
import {
    styleText as _styleText
} from 'node:util';
import _valueToSource from 'isotropic-value-to-source';

export default _make('LoggerPretty', _stream.Writable, {
    _final (callbackFunction) {
        if (this._buffer) {
            this._printRecord(this._buffer);
            this._buffer = '';
        }

        callbackFunction();
    },
    _formatTimestamp (time) {
        const zonedDateTime = (
            typeof time === 'number' ?
                Temporal.Instant.fromEpochMilliseconds(time) :
                Temporal.Instant.from(time)
        ).toZonedDateTimeISO(Temporal.Now.timeZoneId());

        return `${this._padZero(zonedDateTime.year, 4)}-${this._padZero(zonedDateTime.month)}-${this._padZero(zonedDateTime.day)} ${this._padZero(zonedDateTime.hour % 12 || 12)}:${this._padZero(zonedDateTime.minute)}:${this._padZero(zonedDateTime.second)}.${this._padZero(zonedDateTime.millisecond, 3)} ${
            zonedDateTime.hour < 12 ?
                'AM' :
                'PM'
        }`;
    },
    _init () {
        return Object.defineProperty(Reflect.construct(_stream.Writable, [{
            decodeStrings: false
        }], this.constructor), '_buffer', {
            configurable: true,
            enumerable: true,
            value: '',
            writable: true
        });
    },
    _padZero (value, length = 2) {
        return `${value}`.padStart(length, '0');
    },
    _printRecord (line) {
        let content,
            record;

        try {
            record = JSON.parse(line);
        } catch {
            _console.log(line);

            return;
        }

        const details = {},
            level = this.constructor._levelByValue[record.level],
            log = [
                `[${this._formatTimestamp(record.time)}]`,
                `${
                    level ?
                        _styleText(level.format, level.name, {
                            validateStream: false
                        }) :
                        _styleText('bold', `LVL ${record.level}`, {
                            validateStream: false
                        })
                }:`,
                _styleText(
                    'bold',
                    typeof record.msg === 'string' ?
                        record.msg :
                        '',
                    {
                        validateStream: false
                    }
                )
            ];

        Object.keys(record).forEach(key => {
            switch (key) {
                case 'error':
                    if (record.error) {
                        details.error = {
                            code: record.error.code,
                            details: record.error.details,
                            message: record.error.message,
                            name: record.error.name,
                            signal: record.error.signal
                        };

                        if (record.error.stack) {
                            if (Array.isArray(record.error.stack)) {
                                content = record.error.stack.join('\n');
                            } else if (typeof record.error.stack === 'string') {
                                content = record.error.stack;
                            } else {
                                content = _valueToSource(record.error.stack);
                            }
                        }
                    }

                    break;
                case 'hostname':
                case 'level':
                case 'msg':
                case 'name':
                case 'pid':
                case 'time':
                    break;
                default:
                    details[key] = record[key];
                    break;
            }
        });

        if (Object.keys(details).length) {
            log.push(_valueToSource(details));
        }

        _console.log(...log);

        if (content) {
            _console.log(content);
        }
    },
    _write (chunk, encoding, callbackFunction) {
        const lines = `${this._buffer}${chunk}`.split('\n');

        this._buffer = lines.pop();

        lines.forEach(line => {
            if (line) {
                this._printRecord(line);
            }
        });

        callbackFunction();
    }
}, {
    _levelByValue: {
        10: {
            format: 'white',
            name: 'TRACE'
        },
        20: {
            format: 'yellow',
            name: 'DEBUG'
        },
        30: {
            format: 'cyan',
            name: 'INFO'
        },
        40: {
            format: 'magenta',
            name: 'WARN'
        },
        50: {
            format: 'red',
            name: 'ERROR'
        },
        60: {
            format: 'inverse',
            name: 'FATAL'
        }
    }
});
