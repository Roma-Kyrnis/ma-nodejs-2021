const tasks = require('./tasks');
const createDiscount = require('./discount');
const writeCSVFile = require('./writeCSVFile');
const getNameFilesInUploads = require('./getNameFilesInUploads');
const optimizationFiles = require('./optimizationFiles');

module.exports = {
  tasks,
  createDiscount,
  writeCSVFile,
  getNameFilesInUploads,
  optimizationFiles,
};
