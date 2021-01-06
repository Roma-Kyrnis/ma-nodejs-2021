const router = require('@awaitjs/express').Router();

const {
  products: { orders },
} = require('../../controllers');

router.postAsync('/', orders.createOrder);
router.getAsync('/calculate/:orderNumber', orders.calculateOrder);
// router.getAsync('/:id', types.getType);
router.patchAsync('/status/:orderNumber', orders.updateOrderStatus);
// router.deleteAsync('/:id', types.deleteType);

module.exports = router;
