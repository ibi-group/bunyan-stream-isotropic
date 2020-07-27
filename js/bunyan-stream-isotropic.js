import _Bunyan from 'bunyan';
import _chalk from 'chalk';
import _console from 'isotropic-console';
import _moment from 'moment-timezone';
import _valueToSource from 'isotropic-value-to-source';

const _colorFunctionByLevel = {
        10: _chalk.white,
        20: _chalk.yellow,
        30: _chalk.cyan,
        40: _chalk.magenta,
        50: _chalk.red,
        60: _chalk.inverse
    },
    _upperNameByLevel = Object.keys(_Bunyan.nameFromLevel).reduce((upperNameFromLevel, level) => {
        upperNameFromLevel[level] = _colorFunctionByLevel[level](_Bunyan.nameFromLevel[level].toUpperCase());
        return upperNameFromLevel;
    }, {});

export default {
    write (record) {
        const args = [
                `[${_moment(record.time).format('YYYY-MM-DD hh:mm:ss.SSS A')}]`,
                `${_upperNameByLevel[record.level] || _chalk.bold(`LVL ${record.level}`)}:`,
                _chalk.bold(record.msg)
            ],
            details = {};

        let content;

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
                case 'v':
                    break;
                default:
                    details[key] = record[key];
                    break;
            }

            return details;
        }, []);

        if (Object.keys(details).length) {
            args.push(_valueToSource(details));
        }

        _console.log(...args);

        if (content) {
            _console.log(content);
        }
    }
};
