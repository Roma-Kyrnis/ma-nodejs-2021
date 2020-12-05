const tasks = require('./tasks');
const createDiscount = require('./discount');
const writeCSVFile = require('./writeCSVFile');
const getNameFilesInUploads = require('./getNameFilesInUploads');
const optimizationFile = require('./optimizationFile');

module.exports = {
  tasks,
  createDiscount,
  writeCSVFile,
  getNameFilesInUploads,
  optimizationFile,
};
