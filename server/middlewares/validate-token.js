'use strict';
const errorMessages = require('../constants/errors');
const config = require('../config.js');
const jwt = require('../utils/jwt.js');

module.exports = function(req, res, next) {
	const token = req.get('Authorization');

	if (!token) {
		const error = new Error(errorMessages.WRONG_TOKEN);
		error.status = 401;
		next(error);
		return;
	}

	const parsedToken = token.split(' ');
	if (parsedToken.length !== 2 || parsedToken[0] !== 'Bearer') {
		const error = new Error(errorMessages.WRONG_TOKEN);
		error.status = 401;
		next(error);
		return;
	} else {
		const decodedToken = jwt.decodeToken(parsedToken[1], config.secret);
		if (!decodedToken.sub) {
			const error = new Error(errorMessages.WRONG_TOKEN);
			error.status = 401;
			next(error);
			return;
		}
		req.decodedToken = decodedToken;
		console.log('TOKEN is OK');
		next();
	}
};
