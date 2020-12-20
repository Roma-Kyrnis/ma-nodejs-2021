const router = require('@awaitjs/express').Router();

const {
  products: { types },
} = require('../../controllers');

router.postAsync('/', types.createType);
router.getAsync('/', types.getAllTypes);
router.getAsync('/:id', types.getType);
router.patchAsync('/:id', types.updateType);
router.deleteAsync('/:id', types.deleteType);

module.exports = router;
