import _bunyanStreamIsotropic from '../js/bunyan-stream-isotropic.js';
import _chai from 'chai';
import _Error from 'isotropic-error';
import _logger from 'isotropic-logger';
import _mocha from 'mocha';
import _moment from 'moment-timezone';
import _testConsole from 'test-console';

_mocha.describe('bunyan-stream-isotropic', () => {
    _mocha.it('should be a bunyan stream object', () => {
        _chai.expect(_bunyanStreamIsotropic).to.be.an('object');
        _chai.expect(_bunyanStreamIsotropic).to.have.property('write').that.is.a('function');
    });

    _logger.streams = [];
    _logger.addStream({
        level: 'trace',
        name: 'isotropic',
        stream: _bunyanStreamIsotropic,
        type: 'raw'
    });

    _mocha.it('should log a formatted message', () => {
        const moments = [
                _moment()
            ],
            output = _testConsole.stdout.inspectSync(() => {
                _logger.trace('This should be a formatted trace message');
                _logger.debug('This should be a formatted debug message');
                _logger.info('This should be a formatted info message');
                _logger.warn('This should be a formatted warn message');
                _logger.error('This should be a formatted error message');
                _logger.fatal('This should be a formatted fatal message');
                _logger._emit({
                    level: 100,
                    msg: 'This should be a formatted custom message',
                    time: new Date(),
                    v: 0
                });
            }),

            endTime = _moment(),
            regularExpressions = [
                /^\[(.*?)\] \u001b\[37mTRACE\u001b\[39m: \u001b\[1mThis should be a formatted trace message\u001b\[22m\n$/u,
                /^\[(.*?)\] \u001b\[33mDEBUG\u001b\[39m: \u001b\[1mThis should be a formatted debug message\u001b\[22m\n$/u,
                /^\[(.*?)\] \u001b\[36mINFO\u001b\[39m: \u001b\[1mThis should be a formatted info message\u001b\[22m\n$/u,
                /^\[(.*?)\] \u001b\[35mWARN\u001b\[39m: \u001b\[1mThis should be a formatted warn message\u001b\[22m\n$/u,
                /^\[(.*?)\] \u001b\[31mERROR\u001b\[39m: \u001b\[1mThis should be a formatted error message\u001b\[22m\n$/u,
                /^\[(.*?)\] \u001b\[7mFATAL\u001b\[27m: \u001b\[1mThis should be a formatted fatal message\u001b\[22m\n$/u,
                /^\[(.*?)\] \u001b\[1mLVL 100\u001b\[22m: \u001b\[1mThis should be a formatted custom message\u001b\[22m\n$/u
            ];

        _chai.expect(output).to.be.an('array');
        _chai.expect(output.length).to.equal(7);

        output.forEach((output, index) => {
            _chai.expect(output).to.be.a('string');

            const match = output.match(regularExpressions[index]);

            _chai.expect(match).to.be.an('array');

            {
                const moment = _moment(match[1], 'YYYY-MM-DD hh:mm:ss.SSS A', true);

                _chai.expect(moment.isValid()).to.be.true;

                moments.push(moment);
            }
        });

        moments.push(endTime);

        for (let index = 1; index < moments.length; index += 1) {
            _chai.expect(moments[index - 1].isSameOrBefore(moments[index])).to.be.true;
        }
    });

    _mocha.it('should log data fields', () => {
        const output = _testConsole.stdout.inspectSync(() => {
            _logger.info({
                a: 'a',
                b: 'b',
                c: 'c'
            }, 'This should be a formatted info message with data fields');
        });

        _chai.expect(output).to.be.an('array');
        _chai.expect(output.length).to.equal(1);
        _chai.expect(output[0]).to.be.an('string');

        {
            const match = output[0].match(/^\[(.*?)\] \u001b\[36mINFO\u001b\[39m: \u001b\[1mThis should be a formatted info message with data fields\u001b\[22m \{\n {4}a: 'a',\n {4}b: 'b',\n {4}c: 'c'\n\}\n$/u);

            _chai.expect(match).to.be.an('array');
        }
    });

    _mocha.it('should log error stacks', () => {
        const output = _testConsole.stdout.inspectSync(() => {
            _logger.error({
                error: _Error({
                    details: {
                        a: 'a',
                        b: 'b',
                        c: 'c'
                    },
                    message: 'Example error'
                })
            }, 'This should be a formatted error message with an error stack');
        });

        _chai.expect(output).to.be.an('array');
        _chai.expect(output.length).to.equal(2);
        _chai.expect(output[0]).to.be.an('string');

        {
            const match = output[0].match(/^\[(.*?)\] \u001b\[31mERROR\u001b\[39m: \u001b\[1mThis should be a formatted error message with an error stack\u001b\[22m \{\n {4}error: \{\n {8}details: \{\n {12}a: 'a',\n {12}b: 'b',\n {12}c: 'c'\n {8}\},\n {8}message: 'Example error'\n {4}\}\n\}\n$/u);

            _chai.expect(match).to.be.an('array');
        }

        _chai.expect(output[1]).to.be.an('string');
        _chai.expect(output[1].startsWith('Error: Example error\n')).to.be.true;
    });

    _mocha.it('should handle non-error values', () => {
        {
            const output = _testConsole.stdout.inspectSync(() => {
                _logger.error({
                    error: null
                }, 'This should be a formatted error message without an error stack');
            });

            _chai.expect(output).to.be.an('array');
            _chai.expect(output.length).to.equal(1);
            _chai.expect(output[0]).to.be.an('string');

            {
                const match = output[0].match(/^\[(.*?)\] \u001b\[31mERROR\u001b\[39m: \u001b\[1mThis should be a formatted error message without an error stack\u001b\[22m\n$/u);

                _chai.expect(match).to.be.an('array');
            }
        }

        {
            const output = _testConsole.stdout.inspectSync(() => {
                _logger.error({
                    error: {}
                }, 'This should be a formatted error message without an error stack');
            });

            _chai.expect(output).to.be.an('array');
            _chai.expect(output.length).to.equal(1);
            _chai.expect(output[0]).to.be.an('string');

            {
                const match = output[0].match(/^\[(.*?)\] \u001b\[31mERROR\u001b\[39m: \u001b\[1mThis should be a formatted error message without an error stack\u001b\[22m \{\n {4}error: \{\}\n\}\n$/u);

                _chai.expect(match).to.be.an('array');
            }
        }

        {
            const output = _testConsole.stdout.inspectSync(() => {
                _logger.error({
                    error: {
                        stack: {
                            a: 'a',
                            b: 'b',
                            c: 'c'
                        }
                    }
                }, 'This should be a formatted error message with a custom error stack');
            });

            _chai.expect(output).to.be.an('array');
            _chai.expect(output.length).to.equal(2);
            _chai.expect(output[0]).to.be.an('string');

            {
                const match = output[0].match(/^\[(.*?)\] \u001b\[31mERROR\u001b\[39m: \u001b\[1mThis should be a formatted error message with a custom error stack\u001b\[22m \{\n {4}error: \{\}\n\}\n$/u);

                _chai.expect(match).to.be.an('array');
            }

            _chai.expect(output[1]).to.equal('{\n    a: \'a\',\n    b: \'b\',\n    c: \'c\'\n}\n');
        }

        {
            const serializers = _logger.serializers;

            _logger.serializers = [];

            {
                const output = _testConsole.stdout.inspectSync(() => {
                    _logger.error({
                        error: {
                            stack: 'stack'
                        }
                    }, 'This should be a formatted error message with a custom error stack');
                });

                _chai.expect(output).to.be.an('array');
                _chai.expect(output.length).to.equal(2);
                _chai.expect(output[0]).to.be.an('string');

                {
                    const match = output[0].match(/^\[(.*?)\] \u001b\[31mERROR\u001b\[39m: \u001b\[1mThis should be a formatted error message with a custom error stack\u001b\[22m \{\n {4}error: \{\}\n\}\n$/u);

                    _chai.expect(match).to.be.an('array');
                }

                _chai.expect(output[1]).to.equal('stack\n');
            }

            _logger.serializers = serializers;
        }
    });
});
