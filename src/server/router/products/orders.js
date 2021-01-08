const router = require('@awaitjs/express').Router();

const {
  products: { orders },
} = require('../../controllers');

router.postAsync('/', orders.createOrder);
router.getAsync('/:orderNumber', orders.getOrder);
router.getAsync('/', orders.getAllOrders);
router.getAsync('/calculate/:orderNumber', orders.calculateOrder);
router.patchAsync('/status/:orderNumber', orders.updateOrderStatus);

module.exports = router;
