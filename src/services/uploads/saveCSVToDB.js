const { createGunzip } = require('zlib');
const { pipeline } = require('stream');
const { promisify } = require('util');
const byline = require('byline');

const promisifiedPipeline = promisify(pipeline);

const {
  products: { createProduct },
} = require('../../db');

const { createCSVToDB } = require('../../utils');

async function writeCSVFile(inputStream) {
  const gunzip = createGunzip();
  const csvToDB = createCSVToDB.createTransformStreamToDB();

  const outputStream = createCSVToDB.createWriteStreamToDB(createProduct);

  try {
    await promisifiedPipeline(
      inputStream,
      gunzip,
      byline,
      csvToDB,
      outputStream,
    );
  } catch (err) {
    console.error('Failed writeCSVFile', err);
  }
}

module.exports = writeCSVFile;
