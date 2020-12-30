const server = require('./server');
const {
  gracefulShutdown,
  scheduler: { setScheduler, stopScheduler },
} = require('./utils');
const { uploads } = require('./services');
const { init } = require('./db');
const {
  server: { ORIGIN, OPTIMIZATION_TIME },
} = require('./config');

async function start() {
  gracefulShutdown(err => {
    if (err) console.log(`Server stopped because of ${err}`);

    stopScheduler();

    server.stopServer(() => {
      process.exit(1);
    });
  });

  await init();

  setScheduler(async () => {
    console.log('Schedule optimization');

    const files = await uploads.getNameFilesInUploads();

    for (const file of files.uploads) {
      uploads.optimizationFile({ url: new URL(`/${file.filename}`, ORIGIN) });
    }
  }, OPTIMIZATION_TIME);
  server.startServer();
}

start();
