const router = require('@awaitjs/express').Router();

const controller = require('../controllers');

const products = require('./products');
const upload = require('./upload');

router.get('/task1', controller.tasks.functionOne);
router.get('/task2', controller.tasks.functionTwo);
router.get('/task3', controller.tasks.functionThree);

router.post('/setDataGlobal', controller.configureStore.setDataGlobal);
router.post('/writeDataInFile', controller.configureStore.writeDataInFile);

router.useAsync('/products', products);

router.useAsync('/upload', upload);

module.exports = router;
