const router = require('@awaitjs/express').Router();

const { products } = require('../../controllers');

const discounts = require('./discounts');
const types = require('./types');
const colors = require('./colors');
const orders = require('./orders');

router.use('/discounts', discounts);

router.use('/types', types);
router.use('/colors', colors);
router.use('/orders', orders);

router.postAsync('/', products.createProduct);
router.getAsync('/', products.getAllProducts);
router.getAsync('/:id', products.getProduct);
router.patchAsync('/:id', products.updateProduct);
router.deleteAsync('/:id', products.deleteProduct);

module.exports = router;
