const router = require('@awaitjs/express').Router();

const { configureStore, sales, uploads, products } = require('./controllers');

router.post('/setDataGlobal', configureStore.setDataGlobal);
router.post('/writeDataInFile', configureStore.writeDataInFile);

router.get('/products/discounts/callback', sales.callback);
router.getAsync('/products/discounts/promise', sales.promise);
router.getAsync('/products/discounts/async', sales.async);

router.postAsync('/upload', uploads.writeAsyncInFile);
router.getAsync('/upload/filenames', uploads.filenames);
router.postAsync('/upload/optimization/:filename', uploads.optimization);
router.postAsync('/upload/toDB', uploads.writeAsyncInDB);

router.postAsync('/products', products.createProduct);
router.getAsync('/products', products.getAllProducts);
router.getAsync('/products/:id', products.getProduct);
router.patchAsync('/products/:id', products.updateProduct);
router.deleteAsync('/products/:id', products.deleteProduct);

module.exports = router;
