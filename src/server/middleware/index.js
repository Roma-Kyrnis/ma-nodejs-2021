const { isCelebrateError } = require('celebrate');

const {
  authorizationTokens: { verifyAccessToken },
  getAuthToken,
  throwIfInvalid,
} = require('../../utils');

// eslint-disable-next-line no-unused-vars
function errorHandler(incomingError, req, res, next) {
  console.error({ incomingError }, 'Global catch errors');

  let error = incomingError;

  if (isCelebrateError(error)) {
    console.log(incomingError.details.entries(), 'Celebrate errors');

    let errorMessage = 'Invalid: ';
    error.details.forEach((validationError, where) => {
      const message = validationError.details.map(detailError => {
        const detailMessage =
          detailError.path.length > 1
            ? detailError.path.slice(1)
            : detailError.context.peers;
        return `${where}: [${detailMessage.join(', ')}]`;
      });
      errorMessage += `[${message.join(', ')}]`;
    });
    error = { message: errorMessage, status: 400 };
  }

  let errMessage = { message: 'Internal server error!' };
  if (error.status && parseInt(error.status, 10) !== 500 && error.message) {
    res.status(error.status);
    errMessage = { message: error.message };
  } else {
    res.status(500);
  }

  res.json(errMessage);
}

async function authenticateToken(req, res, next) {
  try {
    const token = getAuthToken(req.headers);

    try {
      const data = await verifyAccessToken(token);

      req.authData = data;
    } catch (err) {
      throwIfInvalid(!err, 403, 'Forbidden');
    }

    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = { errorHandler, authenticateToken };
