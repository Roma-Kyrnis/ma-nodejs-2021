const router = require('express').Router();

const controller = require('../controllers');
const { authenticateToken } = require('../middleware');

const login = require('./login');
const products = require('./products');
const upload = require('./upload');

router.get('/login', login);
router.get('/refresh', login);

router.post(
  authenticateToken,
  '/setDataGlobal',
  controller.configureStore.setDataGlobal,
);
router.post(
  authenticateToken,
  '/writeDataInFile',
  controller.configureStore.writeDataInFile,
);

router.use(authenticateToken, '/products', products);

router.use(authenticateToken, '/upload', upload);

module.exports = router;
