const http = require('http');

const requestsHandler = require('./requestHandler');
const { PORT } = require('./config').server;

const server = http.createServer(requestsHandler);
server.listen(Number(PORT), () => {
  console.log('Server started.');
});
