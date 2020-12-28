/* eslint-disable consistent-return */
const express = require('express');
const bodyParser = require('body-parser');

const router = require('./router');
const {
  server: { HOST, PORT },
} = require('../config');
const { errorHandler, login, authenticateToken } = require('./middleware');

const app = express();

app.use(bodyParser.json({ strict: false, type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/login', login);
app.use(authenticateToken, router);

app.use(errorHandler);

let server;

function startServer() {
  server = app.listen(PORT, HOST, () => {
    console.log(`Server is listening on "${HOST}:${PORT}"!`);
  });
}

function stopServer(callback) {
  if (!server) return console.error('Server is not running');

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
