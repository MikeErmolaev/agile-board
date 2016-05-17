'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ColumnSchema = new Schema({
	title: {
		type: String,
		required: true
	},

	board: {
		type: Schema.Types.ObjectId,
		ref: 'Board',
		required: true
	},

	cards: [{
		type: Schema.Types.ObjectId,
		ref: 'Card'
	}]

});

module.exports = mongoose.model('Column', ColumnSchema);
