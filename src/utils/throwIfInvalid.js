function throwIfInvalid(isValid, status = 500, message = '') {
  if (!isValid) {
    const err = new Error(`ERROR: ${message}`);
    err.status = status;
    throw err;
  }

  return true;
}

module.exports = throwIfInvalid;
