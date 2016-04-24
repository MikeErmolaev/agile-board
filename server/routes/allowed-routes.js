'use strict';

const router = require('express').Router();

/*router.get('/', (req, res) => {
	res.sendFile('header.html', { root: `${__dirname}/../../client/templates/`});
});*/

router.post('/login', (req, res) => {
	res.sendStatus(200);
});

module.exports = router;
