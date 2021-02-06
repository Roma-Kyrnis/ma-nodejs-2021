const router = require('@awaitjs/express').Router();

const { uploads } = require('../controllers');

router.postAsync('/', uploads.writeAsyncInFile);
router.getAsync('/filenames', uploads.filenames);
router.postAsync('/optimization/:filename', uploads.optimization);
router.postAsync('/toDB', uploads.writeAsyncInDB);

module.exports = router;
