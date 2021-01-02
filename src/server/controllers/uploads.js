const { uploads } = require('../../services');

async function writeAsyncInFile(req, res) {
  await uploads.writeCSVFile(req);

  res.status(200).json({ message: 'ok' });
}

async function writeAsyncInDB(req, res) {
  uploads.saveCSVToDB(req);

  res.status(202).json({ message: 'Accepted' });
}

async function filenames(req, res) {
  const result = await uploads.getNameFilesInUploads();

  res.status(200).json({ files: result });
}

async function optimization(req, res) {
  uploads.optimizationFile(req);

  res.status(202).json({ message: 'Accepted' });
}

module.exports = {
  writeAsyncInFile,
  filenames,
  optimization,
  writeAsyncInDB,
};
