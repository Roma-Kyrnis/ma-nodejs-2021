const {
  functionOne: task1,
  functionTwo: task2,
  functionThree: task3,
  setDataGlobal,
  writeDataInFile,
  sale
} = require('./controller');

function notFound(res) {
  res.setHeader('Content-Type', 'application/text');
  res.statusCode = 404;
  res.end('404');
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

    case '/sale':
      sale(request, response);
      break;

    default:
      notFound(response);
      break;
  }
};
