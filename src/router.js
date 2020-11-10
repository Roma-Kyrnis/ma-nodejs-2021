const {
  task1,
  task2,
  task3,
  setDataGlobal,
  writeDataInFile,
} = require('./controller');

function notFound(res) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 404;
  res.write('404');
  res.end();
}

module.exports = (request, response) => {
  const { url } = request;

  switch (url.pathname) {
    case '/task1':
      task1(request, response);
      break;

    case '/task2':
      task2(request, response);
      break;

    case '/task3':
      task3(request, response);
      break;

    case '/setDataGlobal':
      setDataGlobal(request, response);
      break;

    case '/writeDataInFile':
      writeDataInFile(request, response);
      break;

    default:
      notFound(response);
      break;
  }
};
