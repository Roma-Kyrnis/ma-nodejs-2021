const { task1, task2, task3 } = require('./controller');

function notFound(res) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 404;
  res.write('404');
  res.end();
}
module.exports = (request, response) => {
  const { url, queryParams, body: data } = request;

  if (url === '/task1') return task1(response);
  if (url === '/task2') return task2(response);
  if (url === '/task3') {
    return task3(data, response, queryParams);
  }

  notFound(response);
};
