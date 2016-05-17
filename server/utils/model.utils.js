'use strict';
const _ = require('lodash');

const ModelUtils = {
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
