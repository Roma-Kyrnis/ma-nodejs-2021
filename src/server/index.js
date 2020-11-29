const http = require('http');

const requestsHandler = require('./requestHandler');
const { PORT } = require('../config').server;

const server = http.createServer(requestsHandler);

function startServer() {
  server.listen(Number(PORT), () => {
    console.log('Server started.');
  });
}

function stopServer(callback) {
  server.close(err => {
    if (err) {
      console.error(err, 'failed to close server');
      callback();
      return;
    }

    console.log('\n\nServer is stopped!\n');
    callback();
  });
}

module.exports = { startServer, stopServer };
