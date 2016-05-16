'use strict';

const User = require('./user.model');

const UserDao = {
	saveUser(email, password, name) {
		const newUser = new User({
			email,
			password,
			name
		});

		return newUser.save().then(user => user.toObject());
	},

	authenticateUser(email, password) {
		return new Promise((resolve, reject) => {
			User.findOne({ email })
				.populate({
							path: 'boards',
							populate: { path: 'creator users', select: 'name id email' }
				})
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
					});
			});
		}); 
	},

	getUserById(id) {
		return new Promise((resolve, reject) => {
			User.findById(id)
				.populate({
							path: 'boards',
							populate: { path: 'creator users', select: 'name id email' }
				})
				.then(user => {
					resolve(user.toObject());
				}, reject);
		});
	}
};

module.exports = UserDao;
