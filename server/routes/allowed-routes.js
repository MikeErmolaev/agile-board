'use strict';

const router = require('express').Router();
const jwt = require('../utils/jwt');
const UserDao = require('../models/User');

router.post('/api/signup', (req, res, next) => {
	const { email, password, name } = req.body;

	if (!email || !password || !name) {
		const error = new Error();
		error.status = 400;

		next(error);
		return;
	}

	UserDao.saveUser(email, password, name).then(user => {
		console.log('USER ID AFTER: ' + user.id)

		const payload = {
			sub: user.id
		};
		const token = jwt.generateToken(payload);

		res.send({ 
			data: {
				success: true,
				user, 
				token
			}
		});
	}).catch(next);
});

router.post('/api/login', (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		const error = new Error();
		error.status = 400;

		next(error);
		return;
	}

	UserDao.authenticateUser(email, password).then(user => {
		const payload = {
			sub: user.id
		};
		const token = jwt.generateToken(payload);

		res.send({ 
			data: {
				success: true,
				user,
				token
			}
		});
	}, res.sendStatus.bind(res)).catch(next);
});

module.exports = router;
