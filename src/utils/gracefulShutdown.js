function gracefulShutdown(exitHandler) {
  process.on('multipleResolves', exitHandler);

  process.on('rejectionHandled', exitHandler);
  process.on('unhandledRejection', exitHandler);

  process.on('uncaughtException', exitHandler);

  process.on('uncaughtExceptionMonitor', exitHandler);

  process.on('SIGINT', exitHandler);
  process.on('SIGTERM', exitHandler);

  process.on('SIGUSR1', exitHandler);
  process.on('SIGUSR2', exitHandler);
}

module.exports = gracefulShutdown;
