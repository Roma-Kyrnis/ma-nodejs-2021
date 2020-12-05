const { tasks, configureStore, sales, uploads } = require('./controllers');

function notFound(res) {
  res.setHeader('Content-Type', 'application/text');
  res.statusCode = 404;
  res.end('404');
}

async function handleRoutes(request, response) {
  const { url } = request;

  switch (url.pathname) {
    case '/task1':
      tasks.functionOne(request, response);
      break;

    case '/task2':
      tasks.functionTwo(request, response);
      break;

    case '/task3':
      tasks.functionThree(request, response);
      break;

    case '/setDataGlobal':
      configureStore.setDataGlobal(request, response);
      break;

    case '/writeDataInFile':
      configureStore.writeDataInFile(request, response);
      break;

    case '/products/discounts/callback':
      sales.callback(request, response);
      break;

    case '/products/discounts/promise':
      sales.promise(request, response);
      break;

    case '/products/discounts/async':
      await sales.async(request, response);
      break;

    case '/upload/filenames':
      await uploads.filenames(request, response);
      break;

    case !/^\/upload\/optimization\/[a-z0-9-]+\.json$/.test(url.pathname) ||
      url.pathname:
      uploads.optimization(request, response);
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
      await uploads.writeAsyncInFile(request, response);
      break;

    default:
      notFound(response);
      break;
  }
}

module.exports = { handleRoutes, handleStreamRoutes };
