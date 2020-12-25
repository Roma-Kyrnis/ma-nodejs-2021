const server = require('./server');
const {
  gracefulShutdown,
  scheduler: { setScheduler, stopScheduler },
} = require('./utils');
const { getNameFilesInUploads, optimizationFile } = require('./services');
const {
  products: { createDBWithTable },
} = require('./db');
const {
  server: { ORIGIN, OPTIMIZATION_TIME },
} = require('./config');

async function start() {
  gracefulShutdown(err => {
    if (err) console.log(err);

    stopScheduler();

    server.stopServer(() => {
      process.exit(1);
    });
  });

  await createDBWithTable();

  setScheduler(async () => {
    console.log('Schedule optimization');

    const files = await getNameFilesInUploads();

    for (const file of files.uploads) {
      optimizationFile({ url: new URL(`/${file.filename}`, ORIGIN) });
    }
  }, OPTIMIZATION_TIME);
  server.startServer();
}

start();
