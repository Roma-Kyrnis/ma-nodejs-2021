const router = require('express').Router();

const controller = require('../controllers');

const products = require('./products');
const upload = require('./upload');

router.post('/setDataGlobal', controller.configureStore.setDataGlobal);
router.post('/writeDataInFile', controller.configureStore.writeDataInFile);

router.use('/products', products);

router.use('/upload', upload);

module.exports = router;
