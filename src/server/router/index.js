const router = require('@awaitjs/express').Router();

const { validations } = require('../../lib/api_v1');
const { authorization, configureStore } = require('../controllers');
const { authenticateToken } = require('../middleware');

const products = require('./products');
const upload = require('./upload');

router.getAsync('/login', authorization.login);
router.getAsync('/refresh-tokens', authorization.refreshTokens);
router.getAsync('/logout', authorization.logout);

router.post(
  '/setDataGlobal',
  authenticateToken,
  validations.arrayProducts,
  configureStore.setDataGlobal,
);
router.post(
  '/writeDataInFile',
  authenticateToken,
  validations.arrayProducts,
  configureStore.writeDataInFile,
);

router.use('/products', authenticateToken, products);

router.use('/upload', authenticateToken, upload);

module.exports = router;
