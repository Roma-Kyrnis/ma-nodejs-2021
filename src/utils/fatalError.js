const fatalError = message => {
  console.error(`FATAL: ${message}`);
  process.exit(1);
};

module.exports = fatalError;
