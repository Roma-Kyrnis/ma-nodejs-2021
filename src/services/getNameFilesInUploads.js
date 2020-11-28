const fsp = require('fs').promises;

const {
  dirStoreNames: { MAIN },
} = require('../config');

async function getNameFilesInFolder() {
  try {
    return await fsp.readdir(MAIN);
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = getNameFilesInFolder;
