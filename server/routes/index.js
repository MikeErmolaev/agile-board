'use strict';

const router = require('express').Router();

router.use(require('./allowed-routes'));
router.use(require('./protected-routes'));
router.use(require('./user-routes'));

module.exports = router;
