const { parse: parseQuery } = require('querystring');
const { URL } = require('url');
const { handleRoutes, handleStreamRoutes } = require('./router');
const { ORIGIN } = require('./config').server;

function internalServerError(res, err) {
  const errMess = { message: 'Internal error occurred' };
  if (process.env.NODE_ENV === 'development') errMess.Error = err;

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 500;
  res.write(JSON.stringify(errMess));
  res.end();
}

module.exports = (request, response) => {
  try {
    if (/^text\/csv/.test(request.headers['content-type'])) {
      handleStreamRoutes(request, response);
      return;
    }

    const { url } = request;
    const parsedUrl = new URL(url, ORIGIN);
    const queryParams = parseQuery(parsedUrl.search.substr(1));

    let body = [];

    request
      .on('error', err => {
        console.error(err);
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', async () => {
        body = Buffer.concat(body).toString();

        try {
          await handleRoutes(
            {
              ...request,
              body: body ? JSON.parse(body) : {},
              url: parsedUrl,
              queryParams,
            },
            response,
          );
        } catch (err) {
          console.error('some router problem', err);
        }
      });
  } catch (error) {
    console.log(error);
    internalServerError(response, error);
  }
};
