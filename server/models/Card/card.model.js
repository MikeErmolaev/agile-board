'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
	title: {
		type: String,
		required: true
	},

	done: {
		type: Boolean,
		default: false
	},

	assignee: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},

	board: {
		type: Schema.Types.ObjectId,
		ref: 'Board'
	},

	column: {
		type: Schema.Types.ObjectId,
		ref: 'Column'
	}

});

module.exports = mongoose.model('Card', CardSchema);
