const router = require('@awaitjs/express').Router();

const {
  products: { colors },
} = require('../../controllers');

router.postAsync('/', colors.createColor);
router.getAsync('/', colors.getAllColors);
router.getAsync('/deleted', colors.getAllDeletedColors);
router.getAsync('/:id', colors.getColor);
router.patchAsync('/:id', colors.updateColor);
router.deleteAsync('/:id', colors.deleteColor);

module.exports = router;
