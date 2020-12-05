/* eslint-disable no-return-await */

const { httpResponses } = require('../../utils');
const {
  writeCSVFile,
  getNameFilesInUploads,
  optimizationFile,
} = require('../../services');

async function writeAsyncInFile(request, response) {
  const { method } = request;

  if (method !== 'POST') return httpResponses.methodNotAllowed(response);

  try {
    await writeCSVFile(request);
  } catch (err) {
    console.error('In controller', err);
    return httpResponses.internalServerError(response);
  }

  return httpResponses.ok(response);
}

async function filenames(request, response) {
  const { method } = request;

  if (method !== 'GET') return httpResponses.methodNotAllowed(response);

  let names;
  try {
    names = await getNameFilesInUploads();
  } catch (err) {
    console.error('nameFiles In controller', err);
    return httpResponses.internalServerError(response);
  }

  return httpResponses.ok(response, names);
}

function optimization(request, response) {
  const { method } = request;

  if (method !== 'POST') return httpResponses.methodNotAllowed(response);

  optimizationFile(request);

  return httpResponses.accepted(response);
}

module.exports = { writeAsyncInFile, filenames, optimization };
