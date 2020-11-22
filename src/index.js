const server = require('./app');
const { gracefulShutdown } = require('./services/server');
const {
  setPeriodOptimization,
  stopOptimization,
} = require('./services/server').optimization;

function start() {
  gracefulShutdown(server.stopServer, stopOptimization);
  setPeriodOptimization();
  server.startServer();
}

start();
