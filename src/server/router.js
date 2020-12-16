const router = require('@awaitjs/express').Router();

const {
  tasks,
  configureStore,
  sales,
  uploads,
  products,
} = require('./controllers');

router.get('/task1', tasks.functionOne);
router.get('/task2', tasks.functionTwo);
router.get('/task3', tasks.functionThree);

router.post('/setDataGlobal', configureStore.setDataGlobal);
router.post('/writeDataInFile', configureStore.writeDataInFile);

router.get('/products/discounts/callback', sales.callback);
router.getAsync('/products/discounts/promise', sales.promise);
router.getAsync('/products/discounts/async', sales.async);

router.postAsync('/upload', uploads.writeAsyncInFile);
router.getAsync('/upload/filenames', uploads.filenames);
router.postAsync('/upload/optimization/:filename', uploads.optimization);
router.postAsync('/upload/toDB', uploads.writeAsyncInDB);

router.postAsync('/products/add', products.createProduct);
router.getAsync('/products/get/:id', products.getProduct);
router.putAsync('/products/update/:id', products.updateProduct);
router.deleteAsync('/products/delete/:id', products.deleteProduct);
router.getAsync('/products/getAll', products.getAllProducts);

module.exports = router;