'use strict';

const router = require('express').Router();
const jwt = require('../utils/jwt');
const User = require('../models/User');

router.post('/api/signup', (req, res, next) => {
	const email = req.body.email;
	const password = req.boy.password;
	const name = req.body.name;

	if (!email || !password || !name) {
		const error = new Error();
		error.status = 400;

		next(error);
		return;
	}

	const newUser = new User({
		email: req.body.email,
		password: req.body.password,
		name: req.body.name
	});

	newUser.save((err) => {
		if (err) {
			next(err);
		} else {
			const payload = {
				sub: req.body.email
			};
			const token = jwt.generateToken(payload);
			res.send({ 
				data: {
					success: true,
					token
				}
			});
		}
	});	
});

router.post('/api/login', (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		const error = new Error();
		error.status = 400;

		next(error);
		return;
	}

	User.findOne({ email }, (err, user) => {
		if (err) {
			next(err);
		}

		user.comparePassword(password, (err, isMatch) => {
			if (err) {
				next(err);
			} else {
				if (isMatch) {
					const payload = {
						sub: email
					};
					const token = jwt.generateToken(payload);
					res.send({ 
						data: {
							success: true,
							token
						}
					});
				} else {
					res.sendStatus(401);
				}
			}
		});
	});
});

module.exports = router;
