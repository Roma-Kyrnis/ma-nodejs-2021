const router = require('@awaitjs/express').Router();

const { uploads } = require('../controllers');

router.postAsync('/upload', uploads.writeAsyncInFile);
router.getAsync('/upload/filenames', uploads.filenames);
router.postAsync('/upload/optimization/:filename', uploads.optimization);
router.postAsync('/upload/toDB', uploads.writeAsyncInDB);

module.exports = router;
