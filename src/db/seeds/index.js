const { init, testConnection, close, types, colors } = require('../index');
const config = require('../../config');

async function createSeeds(seeds) {
  try {
    await init();

    await testConnection();

    for await (const type of seeds.TYPES) {
      await types.createType(type);
    }

    for await (const color of seeds.COLORS) {
      await colors.createColor(color);
    }

    await close();

    console.log('The seeds are planted!');

    process.exit(0);
  } catch (err) {
    console.error('Cannot create seeds.', err.message || err);
    process.exit(1);
  }
}

createSeeds(config.seeds);
