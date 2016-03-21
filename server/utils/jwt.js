'use strict';

const config = require('../config.js');
const jwt = require('jwt-simple');
const _ = require('lodash');


module.exports = {
	generateToken(payload) {
		if (!payload || !_.isPlainObject(payload)) {
			throw new Error('Payload argument should be object');
		}

		return jwt.encode(payload, config.secret);
	},

	decodeToken(token) {
		if(!_.isString(token)) {
			throw new Error('Token argument should be string');
		}
		
		return jwt.decode(token, config.secret);
	}
};
