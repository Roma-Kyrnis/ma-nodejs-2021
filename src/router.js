const { task1, task2, task3, setData } = require('./controller');

function notFound(res) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 404;
  res.write('404');
  res.end();
}

module.exports = (request, response) => {
  const { url } = request;

  if (url === '/task1') task1(request, response);
  if (url === '/task2') task2(request, response);
  if (url === '/task3') task3(request, response);
  if (url === '/setData') setData();

  notFound(response);
};
