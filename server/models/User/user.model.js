'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;
const _ = require('lodash');

const UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},

	password: {
		type: String,
		required: true
	},

	name: {
		type: String,
		required: true
	},

	boards: [{
		type: Schema.Types.ObjectId,
		ref: 'Board'
	}]

});

UserSchema.set('toObject', { 
	transform: (doc, ret) => {
		ret.id = ret._id;
		delete ret._id;
		delete ret.password;
		delete ret.__v;
		_.forEach(ret.boards, board => {
			if (_.isPlainObject(board)) {
				board.id = board._id;
				delete board._id;
				delete board.__v;
			}
		})
	}
});

UserSchema.pre('save', function(next) {
	var user = this;

	if (!user.isModified('password')) {
		return next();
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
		if (err) {
			return next(err);
		}

		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) {
				return next(err);
			}

			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if (err) {
			return cb(err);
		}

		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema);
