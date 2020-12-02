const server = require('./server');
const {
  gracefulShutdown,
  scheduler: { setScheduler, stopScheduler },
} = require('./utils');
const {
  writeCSVFile,
  getNameFilesInUploads,
  optimizationFile,
} = require('./services');

function start() {
  gracefulShutdown(err => {
    if (err) console.log(err);

    stopScheduler();

    server.stopServer(() => {
      process.exit(1);
    });
  });

  setScheduler(async () => {
    console.log('Schedule optimization');

    const files = await getNameFilesInUploads();

    for (const file of files.uploads) {
      optimizationFile({ url: new URL(`/${file.filename}`) });
    }
  });
  server.startServer();
}

start();
