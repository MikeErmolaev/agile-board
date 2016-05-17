'use strict';
const _ = require('lodash');

const ModelUtils = {
	populateQueries: {
		USER: {
			path: 'boards',
			select: 'id title creator'
		},

		BOARD: {
			path: 'columns',
			select: 'id title cards',
			populate: {
				path: 'cards',
				select: 'id title done assignee board column'
			}
		}
	},

	renameNestedIdField(object) {
		if (object._id) {
			object.id = object._id;
			delete object._id;
		}

		_.forEach(object, prop => {
			if (_.isObject(prop)) {
				if (prop._id) {
					prop.id = prop._id;
					delete prop._id;
				}

				this.renameNestedIdField(prop);
			}
		});
	} 
}

module.exports = ModelUtils;
