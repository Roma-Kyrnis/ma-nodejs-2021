require('dotenv').config();

const config = {
  server: {
    PORT: process.env.PORT,
    ORIGIN: process.env.ORIGIN,
  },
};

module.exports = config;
