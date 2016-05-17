'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ModelUtils = require('../../utils/model.utils');

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
	}],

	columns: [{
		type: Schema.Types.ObjectId,
		ref: 'Column'
	}]

});

BoardSchema.set('toObject', { 
	transform: (doc, ret) => {
		delete ret.__v;
		ModelUtils.renameNestedIdField(ret);
	}
});

module.exports = mongoose.model('Board', BoardSchema);
