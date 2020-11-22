let stopServer;
let stopInterval;

function exitHandler(err) {
  if (err) console.error(err);

  stopInterval();

  stopServer(() => {
    process.exit(0);
  });
}

function gracefulShutdown(server, interval) {
  stopServer = server;
  stopInterval = interval;

  process.on('multipleResolves', exitHandler);

  process.on('rejectionHandled', exitHandler);
  process.on('unhandledRejection', exitHandler);

  process.on('uncaughtException', exitHandler);

  process.on('uncaughtExceptionMonitor', exitHandler);

  process.on('unhandledRejection', exitHandler);

  process.on('SIGINT', exitHandler);
  process.on('SIGTERM', exitHandler);

  process.on('SIGUSR1', exitHandler);
  process.on('SIGUSR2', exitHandler);
}

module.exports = gracefulShutdown;
