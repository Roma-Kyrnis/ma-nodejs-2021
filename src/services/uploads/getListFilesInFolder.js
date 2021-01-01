const fsp = require('fs').promises;

const {
  dirStoreNames: { MAIN, OPTIMIZATION },
} = require('../../config');

async function getListFilesInFolder() {
  const filenamesWithTimeAndSize = { uploads: [], optimized: [] };

  try {
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
      } else if (fileStats.nlink === 2 && filename === 'optimized') {
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
  } catch (err) {
    throw new Error(err);
  }

  return filenamesWithTimeAndSize;
}

module.exports = getListFilesInFolder;
