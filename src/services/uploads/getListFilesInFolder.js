const fsp = require('fs').promises;

const {
  fileStorage: { MAIN, OPTIMIZATION, NAME_OPTIMIZED_FOLDER },
} = require('../../config');

async function getListFilesInFolder() {
  const filenamesWithTimeAndSize = { uploads: [], optimized: [] };

  const filenames = await fsp.readdir(MAIN);

  let optimizationFilenames = [];

  for await (const filename of filenames) {
    const absolutePathToFile = `${MAIN}/${filename}`;
    const fileStats = await fsp.stat(absolutePathToFile);

    if (fileStats.nlink === 1) {
      filenamesWithTimeAndSize.uploads.push({
        filename,
        time: fileStats.birthtime,
        size: fileStats.size, // bytes
      });
    } else if (fileStats.nlink === 2 && filename === NAME_OPTIMIZED_FOLDER) {
      optimizationFilenames = await fsp.readdir(absolutePathToFile);
    }
  }

  for await (const filename of optimizationFilenames) {
    const fileStats = await fsp.stat(`${OPTIMIZATION}/${filename}`);
    const file = {
      filename,
      time: fileStats.birthtime,
      size: fileStats.size, // bytes
    };

    if (fileStats.nlink === 1) filenamesWithTimeAndSize.optimized.push(file);
  }

  return filenamesWithTimeAndSize;
}

module.exports = getListFilesInFolder;
