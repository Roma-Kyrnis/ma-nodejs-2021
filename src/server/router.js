const router = require('express').Router();

const { tasks, configureStore, sales, uploads } = require('./controllers');

router.get('/task1', tasks.functionOne);
router.get('/task2', tasks.functionTwo);
router.get('/task3', tasks.functionThree);

router.post('/setDataGlobal', configureStore.setDataGlobal);
router.post('/writeDataInFile', configureStore.writeDataInFile);

router.get('/products/discounts/callback', sales.callback);
router.get('/products/discounts/promise', sales.promise);
router.get('/products/discounts/async', sales.async);

router.post('/upload', uploads.writeAsyncInFile);
router.get('/upload/filenames', uploads.filenames);
router.post('/upload/optimization/:filename', uploads.optimization);

module.exports = router;
