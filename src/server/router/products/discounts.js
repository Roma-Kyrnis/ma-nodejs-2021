const router = require('@awaitjs/express').Router();

const { sales } = require('../../controllers');

router.get('/callback', sales.callback);
router.getAsync('/promise', sales.promise);
router.getAsync('/async', sales.async);

module.exports = router;
