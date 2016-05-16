'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
	title: {
		type: String,
		required: true
	},

	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},

	users: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
});

module.exports = mongoose.model('Board', BoardSchema);
