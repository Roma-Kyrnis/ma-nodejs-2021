const { createGunzip } = require('zlib');
const { pipeline } = require('stream');
const { promisify } = require('util');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const byline = require('byline');

const {
  fileStorage: { MAIN },
} = require('../../config');
const { createCsvToJson } = require('../../utils');

if (!fs.existsSync(MAIN)) fs.mkdirSync(MAIN);

const promisifiedPipeline = promisify(pipeline);

async function writeCSVFile(inputStream) {
  const gunzip = createGunzip();
  const csvToJson = createCsvToJson();

  const timestamp = uuidv4();
  const filePath = `${MAIN}/${timestamp}.json`;
  const outputStream = fs.createWriteStream(filePath);

  try {
    await promisifiedPipeline(
      inputStream,
      gunzip,
      byline,
      csvToJson,
      outputStream,
    );
  } catch (err) {
    console.error('Failed writeCSVFile', err);
  }
}

module.exports = writeCSVFile;
