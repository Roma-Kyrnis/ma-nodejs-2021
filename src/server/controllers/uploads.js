const {
  writeCSVFile,
  getNameFilesInUploads,
  optimizationFile,
} = require('../../services');

async function writeAsyncInFile(req, res) {
  try {
    await writeCSVFile(req);

    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function filenames(req, res) {
  try {
    const result = await getNameFilesInUploads();

    res.status(200).json({ files: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function optimization(req, res) {
  try {
    await optimizationFile(req);

    res.status(202).json({ message: 'Accepted' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message || 'Bad request' });
  }
}

module.exports = { writeAsyncInFile, filenames, optimization };
