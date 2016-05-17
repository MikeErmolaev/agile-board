'use strict';

const User = require('./user.model');
const { populateQueries } = require('../../utils/model.utils');

const UserDao = {
	saveUser(email, password, name) {
		const newUser = new User({
			email,
			password,
			name
		});

		return newUser.save().then(user => user.toObject(), err => { throw err });
	},

	authenticateUser(email, password) {
		return new Promise((resolve, reject) => {
			User.findOne({ email })
				.populate(populateQueries.USER)
				.exec((err, user) => {
					if (!err && !user) {
						return reject(401);
					}

					if (err) {
						throw err;
					}

					user.comparePassword(password, (err, isMatch) => {

						if (isMatch) {
							resolve(user.toObject());
						} else {
							reject(401);
						}
					}, err => { throw err });
			});
		}); 
	},

	getUserById(id) {
		return User.findById(id)
					.populate(populateQueries.USER)
					.exec()
					.then(user => {
						if (!user) {
							return Promise.reject(401)
						}

						return user.toObject()
					}, err => { throw err });
	}
};

module.exports = UserDao;
