'use strict';

const router = require('express').Router();

router.get('/', (req, res) => {
	res.sendStatus(200);
});

router.post('/login', (req, res) => {
	// res.sendStatus(401);
	res.json({token: 'asdfsdag'});
});

module.exports = router;
