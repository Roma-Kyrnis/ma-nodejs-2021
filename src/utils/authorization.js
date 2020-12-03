function authorization(req, res, next) {
  console.log(
    `Welcome ${req.auth.user} (your password is ${req.auth.password})`,
  );

  next();
}

module.exports = authorization;
