const {
  functionOne: task1,
  functionTwo: task2,
  functionThree: task3,
  setDataGlobal,
  writeDataInFile,
  salesCallback,
  salesPromise,
  salesAsync,
  writeAsyncInFile,
  filenames,
} = require('./controller');

function notFound(res) {
  res.setHeader('Content-Type', 'application/text');
  res.statusCode = 404;
  res.end('404');
}

async function handleRoutes(request, response) {
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

    case '/products/discounts/callback':
      salesCallback(request, response);
      break;

    case '/products/discounts/promise':
      salesPromise(request, response);
      break;

    case '/products/discounts/async':
      await salesAsync(request, response);
      break;

    case '/upload/filenames':
      await filenames(request, response);
      break;

    default:
      notFound(response);
      break;
  }
}

async function handleStreamRoutes(request, response) {
  const { url } = request;

  switch (url) {
    case '/upload':
      await writeAsyncInFile(request, response);
      break;

    default:
      notFound(response);
      break;
  }
}

module.exports = { handleRoutes, handleStreamRoutes };
