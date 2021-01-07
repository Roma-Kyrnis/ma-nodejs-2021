function throwIfInvalid(isValid, status = 500, message = '') {
  if (!isValid) {
    const err = new Error(message);
    err.status = status;
    throw err;
  }

  return true;
}

module.exports = throwIfInvalid;
