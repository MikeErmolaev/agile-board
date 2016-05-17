'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;
const ModelUtils = require('../../utils/model.utils');

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
		delete ret.password;
		delete ret.__v;
		ModelUtils.renameNestedIdField(ret);
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
