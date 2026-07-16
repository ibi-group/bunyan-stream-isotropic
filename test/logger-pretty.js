import _chai from 'isotropic-dev-dependencies/lib/chai.js';
import _LoggerPretty from '../lib/logger-pretty.js';
import _stream from 'node:stream';
import _test from 'node:test';
import _testConsole from 'test-console';

const _capture = records => {
    const loggerPretty = _LoggerPretty();

    return _testConsole.stdout.inspectSync(() => {
        records.forEach(record => {
            loggerPretty.write(`${JSON.stringify(record)}\n`);
        });
    });
};

_test.describe('_LoggerPretty', () => {
    _test.it('should construct logger pretty objects', () => {
        _chai.expect(_LoggerPretty).to.be.a('function');
        _chai.expect(_LoggerPretty).to.have.property('name').that.equals('LoggerPretty');

        const loggerPretty = new _LoggerPretty();

        _chai.expect(loggerPretty).to.be.a('LoggerPretty');
        _chai.expect(loggerPretty).to.be.an.instanceOf(_LoggerPretty);
        _chai.expect(loggerPretty).to.be.an.instanceOf(_stream.Writable);
        _chai.expect(loggerPretty).to.have.property('end').that.is.a('function');
        _chai.expect(loggerPretty).to.have.property('writable').that.equals(true);
        _chai.expect(loggerPretty).to.have.property('write').that.is.a('function');
    });

    _test.it('should be a logger pretty object factory', () => {
        const loggerPretty = _LoggerPretty();

        _chai.expect(loggerPretty).to.be.an.instanceOf(_LoggerPretty);
        _chai.expect(loggerPretty).to.be.an.instanceOf(_stream.Writable);
        _chai.expect(loggerPretty).to.have.property('end').that.is.a('function');
        _chai.expect(loggerPretty).to.have.property('writable').that.equals(true);
        _chai.expect(loggerPretty).to.have.property('write').that.is.a('function');
    });

    _test.it('should log a formatted message', () => {
        const output = _capture([{
                hostname: 'host',
                level: 10,
                msg: 'This should be a formatted trace message',
                name: 'isotropic',
                pid: 1,
                time: 1700000000000
            }, {
                hostname: 'host',
                level: 20,
                msg: 'This should be a formatted debug message',
                name: 'isotropic',
                pid: 1,
                time: 1700000000000
            }, {
                hostname: 'host',
                level: 30,
                msg: 'This should be a formatted info message',
                name: 'isotropic',
                pid: 1,
                time: 1700000000000
            }, {
                hostname: 'host',
                level: 40,
                msg: 'This should be a formatted warn message',
                name: 'isotropic',
                pid: 1,
                time: 1700000000000
            }, {
                hostname: 'host',
                level: 50,
                msg: 'This should be a formatted error message',
                name: 'isotropic',
                pid: 1,
                time: 1700000000000
            }, {
                hostname: 'host',
                level: 60,
                msg: 'This should be a formatted fatal message',
                name: 'isotropic',
                pid: 1,
                time: 1700000000000
            }, {
                hostname: 'host',
                level: 100,
                msg: 'This should be a formatted custom message',
                name: 'isotropic',
                pid: 1,
                time: 1700000000000
            }]),
            regularExpressions = [
                /^\[(.*?)\] \u{1b}\[37mTRACE\u{1b}\[39m: \u{1b}\[1mThis should be a formatted trace message\u{1b}\[22m\n$/v,
                /^\[(.*?)\] \u{1b}\[33mDEBUG\u{1b}\[39m: \u{1b}\[1mThis should be a formatted debug message\u{1b}\[22m\n$/v,
                /^\[(.*?)\] \u{1b}\[36mINFO\u{1b}\[39m: \u{1b}\[1mThis should be a formatted info message\u{1b}\[22m\n$/v,
                /^\[(.*?)\] \u{1b}\[35mWARN\u{1b}\[39m: \u{1b}\[1mThis should be a formatted warn message\u{1b}\[22m\n$/v,
                /^\[(.*?)\] \u{1b}\[31mERROR\u{1b}\[39m: \u{1b}\[1mThis should be a formatted error message\u{1b}\[22m\n$/v,
                /^\[(.*?)\] \u{1b}\[7mFATAL\u{1b}\[27m: \u{1b}\[1mThis should be a formatted fatal message\u{1b}\[22m\n$/v,
                /^\[(.*?)\] \u{1b}\[1mLVL 100\u{1b}\[22m: \u{1b}\[1mThis should be a formatted custom message\u{1b}\[22m\n$/v
            ];

        _chai.expect(output).to.be.an('array');
        _chai.expect(output.length).to.equal(7);

        output.forEach((line, index) => {
            _chai.expect(line).to.be.a('string');

            const match = line.match(regularExpressions[index]);

            _chai.expect(match).to.be.an('array');
            _chai.expect(match[1]).to.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} [AP]M$/v);
        });
    });

    _test.it('should log data fields', () => {
        const output = _capture([{
            a: 'a',
            b: 'b',
            c: 'c',
            hostname: 'host',
            level: 30,
            msg: 'This should be a formatted info message with data fields',
            name: 'isotropic',
            pid: 1,
            time: 1700000000000
        }]);

        _chai.expect(output).to.be.an('array');
        _chai.expect(output.length).to.equal(1);
        _chai.expect(output[0]).to.be.a('string');
        _chai.expect(output[0]).to.match(/^\[(.*?)\] \u{1b}\[36mINFO\u{1b}\[39m: \u{1b}\[1mThis should be a formatted info message with data fields\u{1b}\[22m \{\n {4}a: 'a',\n {4}b: 'b',\n {4}c: 'c'\n\}\n$/v);
    });

    _test.it('should log error stacks', () => {
        const output = _capture([{
            error: {
                details: {
                    a: 'a',
                    b: 'b',
                    c: 'c'
                },
                message: 'Example error',
                stack: [
                    'Error: Example error',
                    '    at example (example.js:1:1)'
                ]
            },
            hostname: 'host',
            level: 50,
            msg: 'This should be a formatted error message with an error stack',
            name: 'isotropic',
            pid: 1,
            time: 1700000000000
        }]);

        _chai.expect(output).to.be.an('array');
        _chai.expect(output.length).to.equal(2);
        _chai.expect(output[0]).to.be.a('string');
        _chai.expect(output[0]).to.match(/^\[(.*?)\] \u{1b}\[31mERROR\u{1b}\[39m: \u{1b}\[1mThis should be a formatted error message with an error stack\u{1b}\[22m \{\n {4}error: \{\n {8}details: \{\n {12}a: 'a',\n {12}b: 'b',\n {12}c: 'c'\n {8}\},\n {8}message: 'Example error'\n {4}\}\n\}\n$/v);
        _chai.expect(output[1]).to.equal('Error: Example error\n    at example (example.js:1:1)\n');
    });

    _test.it('should handle non-error values', () => {
        {
            const output = _capture([{
                error: null,
                hostname: 'host',
                level: 50,
                msg: 'This should be a formatted error message without an error stack',
                name: 'isotropic',
                pid: 1,
                time: 1700000000000
            }]);

            _chai.expect(output).to.be.an('array');
            _chai.expect(output.length).to.equal(1);
            _chai.expect(output[0]).to.be.a('string');
            _chai.expect(output[0]).to.match(/^\[(.*?)\] \u{1b}\[31mERROR\u{1b}\[39m: \u{1b}\[1mThis should be a formatted error message without an error stack\u{1b}\[22m\n$/v);
        }

        {
            const output = _capture([{
                error: {},
                hostname: 'host',
                level: 50,
                msg: 'This should be a formatted error message without an error stack',
                name: 'isotropic',
                pid: 1,
                time: 1700000000000
            }]);

            _chai.expect(output).to.be.an('array');
            _chai.expect(output.length).to.equal(1);
            _chai.expect(output[0]).to.be.a('string');
            _chai.expect(output[0]).to.match(/^\[(.*?)\] \u{1b}\[31mERROR\u{1b}\[39m: \u{1b}\[1mThis should be a formatted error message without an error stack\u{1b}\[22m \{\n {4}error: \{\}\n\}\n$/v);
        }

        {
            const output = _capture([{
                error: {
                    stack: {
                        a: 'a',
                        b: 'b',
                        c: 'c'
                    }
                },
                hostname: 'host',
                level: 50,
                msg: 'This should be a formatted error message with a custom error stack',
                name: 'isotropic',
                pid: 1,
                time: 1700000000000
            }]);

            _chai.expect(output).to.be.an('array');
            _chai.expect(output.length).to.equal(2);
            _chai.expect(output[0]).to.be.a('string');
            _chai.expect(output[0]).to.match(/^\[(.*?)\] \u{1b}\[31mERROR\u{1b}\[39m: \u{1b}\[1mThis should be a formatted error message with a custom error stack\u{1b}\[22m \{\n {4}error: \{\}\n\}\n$/v);
            _chai.expect(output[1]).to.equal('{\n    a: \'a\',\n    b: \'b\',\n    c: \'c\'\n}\n');
        }

        {
            const output = _capture([{
                error: {
                    stack: 'stack'
                },
                hostname: 'host',
                level: 50,
                msg: 'This should be a formatted error message with a custom error stack',
                name: 'isotropic',
                pid: 1,
                time: 1700000000000
            }]);

            _chai.expect(output).to.be.an('array');
            _chai.expect(output.length).to.equal(2);
            _chai.expect(output[0]).to.be.a('string');
            _chai.expect(output[0]).to.match(/^\[(.*?)\] \u{1b}\[31mERROR\u{1b}\[39m: \u{1b}\[1mThis should be a formatted error message with a custom error stack\u{1b}\[22m \{\n {4}error: \{\}\n\}\n$/v);
            _chai.expect(output[1]).to.equal('stack\n');
        }
    });

    _test.it('should default a missing message to an empty string', () => {
        const output = _capture([{
            hostname: 'host',
            level: 30,
            name: 'isotropic',
            pid: 1,
            time: 1700000000000
        }]);

        _chai.expect(output).to.be.an('array');
        _chai.expect(output.length).to.equal(1);
        _chai.expect(output[0]).to.be.a('string');
        _chai.expect(output[0]).to.match(/^\[(.*?)\] \u{1b}\[36mINFO\u{1b}\[39m: \u{1b}\[1m\u{1b}\[22m\n$/v);
    });

    _test.it('should format timestamps', () => {
        const output = _capture([{
                hostname: 'host',
                level: 30,
                msg: 'midnight',
                name: 'isotropic',
                pid: 1,
                time: 0
            }, {
                hostname: 'host',
                level: 30,
                msg: 'afternoon',
                name: 'isotropic',
                pid: 1,
                time: 48645123
            }, {
                hostname: 'host',
                level: 30,
                msg: 'string time',
                name: 'isotropic',
                pid: 1,
                time: '2026-06-20T09:15:30.500Z'
            }, {
                hostname: 'host',
                level: 30,
                msg: 'spacific time',
                name: 'isotropic',
                pid: 1,
                time: new Temporal.PlainDateTime('2026', '06', '21').toZonedDateTime(Temporal.Now.timeZoneId())
            }]),
            regularExpression = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} [AP]M$/v;

        _chai.expect(output).to.be.an('array');
        _chai.expect(output.length).to.equal(4);
        _chai.expect(output[0].match(/^\[(.*?)\]/v)[1]).to.match(regularExpression);
        _chai.expect(output[1].match(/^\[(.*?)\]/v)[1]).to.match(regularExpression);
        _chai.expect(output[2].match(/^\[(.*?)\]/v)[1]).to.match(regularExpression);
        _chai.expect(output[3].match(/^\[(.*?)\]/v)[1]).to.equal('2026-06-21 12:00:00.000 AM');
    });

    _test.it('should buffer a record split across multiple writes', () => {
        const loggerPretty = _LoggerPretty(),
            output = _testConsole.stdout.inspectSync(() => {
                loggerPretty.write('{"level":30,"name":"isotropic","pid":1,"time":1700000000000,"msg":"split ');
                loggerPretty.write('across writes"}\n');
            });

        _chai.expect(output).to.be.an('array');
        _chai.expect(output.length).to.equal(1);
        _chai.expect(output[0]).to.match(/^\[(.*?)\] \u{1b}\[36mINFO\u{1b}\[39m: \u{1b}\[1msplit across writes\u{1b}\[22m\n$/v);
    });

    _test.it('should skip blank lines', () => {
        const loggerPretty = _LoggerPretty(),
            output = _testConsole.stdout.inspectSync(() => {
                loggerPretty.write('{"level":30,"name":"isotropic","pid":1,"time":1700000000000,"msg":"before blank"}\n\n');
            });

        _chai.expect(output).to.be.an('array');
        _chai.expect(output.length).to.equal(1);
        _chai.expect(output[0]).to.match(/before blank/v);
    });

    _test.it('should pass through a line that is not valid JSON', () => {
        const loggerPretty = _LoggerPretty(),
            output = _testConsole.stdout.inspectSync(() => {
                loggerPretty.write('this is not valid json\n');
            });

        _chai.expect(output).to.be.an('array');
        _chai.expect(output).to.deep.equal([
            'this is not valid json\n'
        ]);
    });

    _test.it('should flush a buffered record when the stream ends', async () => {
        const output = await _testConsole.stdout.inspectAsync(async () => {
            const loggerPretty = _LoggerPretty();

            await new Promise(resolve => {
                loggerPretty.on('finish', resolve);
                loggerPretty.end('{"level":30,"name":"isotropic","pid":1,"time":1700000000000,"msg":"unterminated final record"}');
            });
        });

        _chai.expect(output).to.be.an('array');
        _chai.expect(output.length).to.equal(1);
        _chai.expect(output[0]).to.match(/^\[(.*?)\] \u{1b}\[36mINFO\u{1b}\[39m: \u{1b}\[1munterminated final record\u{1b}\[22m\n$/v);
    });

    _test.it('should end cleanly when no record is buffered', async () => {
        const output = await _testConsole.stdout.inspectAsync(async () => {
            const loggerPretty = _LoggerPretty();

            await new Promise(resolve => {
                loggerPretty.on('finish', resolve);
                loggerPretty.end('{"level":30,"name":"isotropic","pid":1,"time":1700000000000,"msg":"terminated record"}\n');
            });
        });

        _chai.expect(output).to.be.an('array');
        _chai.expect(output.length).to.equal(1);
        _chai.expect(output[0]).to.match(/terminated record/v);
    });
});
