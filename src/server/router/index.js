const router = require('@awaitjs/express').Router();

const { authorization, configureStore } = require('../controllers');
const { authenticateToken } = require('../middleware');

const products = require('./products');
const upload = require('./upload');

router.getAsync('/login', authorization.login);
// router.getAsync('/refresh-tokens', authorization.refreshTokens);
// router.getAsync('/logout', authorization.logout);

router.post('/setDataGlobal', authenticateToken, configureStore.setDataGlobal);
router.post(
  '/writeDataInFile',
  authenticateToken,
  configureStore.writeDataInFile,
);

router.use('/products', authenticateToken, products);

router.use('/upload', authenticateToken, upload);

module.exports = router;
