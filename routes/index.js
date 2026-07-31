const router = require('express').Router();
const petsRouter = require('./pets');
const applicationsRouter = require('./applications');
const sheltersRouter = require("./shelters");

router.use('/', petsRouter);
router.use('/', applicationsRouter);
router.use('/shelters', sheltersRouter);

module.exports = router;
