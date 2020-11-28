const { createGunzip } = require('zlib');
const { pipeline } = require('stream');
const { promisify } = require('util');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const { MAIN } = require('../config').dirStoreNames;

if (!fs.existsSync(MAIN)) fs.mkdirSync(MAIN);

const promisifiedPipeline = promisify(pipeline);

const { createCsvToJson } = require('../utils');

async function writeCSVFile(InputStream) {
  const gunzip = createGunzip();

  const timestamp = uuidv4();
  const filePath = `${MAIN}/${timestamp}.json`;
  const outputStream = fs.createWriteStream(filePath);
  const csvToJson = createCsvToJson();

  try {
    await promisifiedPipeline(InputStream, gunzip, csvToJson, outputStream);
  } catch (err) {
    console.error('Failed writeCSVFile', err);
  }
}

module.exports = writeCSVFile;
