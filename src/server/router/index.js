const router = require('@awaitjs/express').Router();

const controller = require('../controllers');

const products = require('./products');
const upload = require('./upload');

router.post('/setDataGlobal', controller.configureStore.setDataGlobal);
router.post('/writeDataInFile', controller.configureStore.writeDataInFile);

router.useAsync('/products', products);

router.useAsync('/upload', upload);

module.exports = router;
