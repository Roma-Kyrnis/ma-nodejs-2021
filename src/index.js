const server = require('./server');
const {
  gracefulShutdown,
  scheduler: { setScheduler, stopScheduler },
} = require('./utils');

function start() {
  gracefulShutdown(err => {
    if (err) console.log(err);

    stopScheduler();

    server.stopServer(() => {
      process.exit(1);
    });
  });

  setScheduler(() => console.log('Schedule optimization'));
  server.startServer();
}

start();
