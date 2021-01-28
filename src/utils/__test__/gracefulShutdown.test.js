const gracefulShutdown = require('../gracefulShutdown');

describe('check if exitHandler was called', () => {
  const exitHandlerMock = jest.fn();

  beforeAll(() => {
    gracefulShutdown(exitHandlerMock);
  });

  test('check multipleResolves', () => {
    process.emit('multipleResolves');

    expect(exitHandlerMock).toHaveBeenCalledTimes(1);
  });

  test('check rejectionHandled', () => {
    process.emit('rejectionHandled');

    expect(exitHandlerMock).toHaveBeenCalledTimes(2);
  });

  test('check unhandledRejection', () => {
    process.emit('unhandledRejection');

    expect(exitHandlerMock).toHaveBeenCalledTimes(3);
  });

  test('check uncaughtException', () => {
    process.emit('uncaughtException');

    expect(exitHandlerMock).toHaveBeenCalledTimes(4);
  });

  test('check uncaughtExceptionMonitor', () => {
    process.emit('uncaughtExceptionMonitor');

    expect(exitHandlerMock).toHaveBeenCalledTimes(5);
  });

  test('check SIGINT', () => {
    process.emit('SIGINT');

    expect(exitHandlerMock).toHaveBeenCalledTimes(6);
  });

  test('check SIGTERM', () => {
    process.emit('SIGTERM');

    expect(exitHandlerMock).toHaveBeenCalledTimes(7);
  });

  test('check SIGUSR1', () => {
    process.emit('SIGUSR1');

    expect(exitHandlerMock).toHaveBeenCalledTimes(8);
  });

  test('check SIGUSR2', () => {
    process.emit('SIGUSR2');

    expect(exitHandlerMock).toHaveBeenCalledTimes(9);
  });
})
