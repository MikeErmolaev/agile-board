'use strict';

const Board = require('./board.model');
const User = require('../User/user.model');
const mongoose = require('mongoose');

const BoardDao = {
	saveBoard(title, creator) {
		const newBoard = new Board({
			title,
			creator: creator,
			users: [creator]
		});

		return newBoard.save().then(board => {
			return User.findByIdAndUpdate(creator, { $push: { boards: board.id } }, { new: true })
						.populate({
							path: 'boards',
							populate: { path: 'creator users', select: 'name id email' }
						})
						.exec()
						.then(user => user.toObject());
		});
	},

	deleteBoard(boardId, creatorId) {
		return Board.findByIdAndRemove(boardId).then(doc => {
			return User.findByIdAndUpdate(creatorId, { $pull: { boards: doc.id } }, { new: true })
						.populate({
							path: 'boards',
							populate: { path: 'creator users', select: 'name id email' }
						})
						.exec()
						.then(user => user.toObject());
		});
	}
}

module.exports = BoardDao;
