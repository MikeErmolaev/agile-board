'use strict';

const Board = require('./board.model');
const User = require('../User/user.model');
const Column = require('../Column/column.model');
const Card = require('../Card/card.model');
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
							select: 'id title creator'
						})
						.exec()
						.then(user => user.toObject());
		});
	},

	deleteBoard(boardId) {
		return Board.findByIdAndRemove(boardId).then(doc => {
			return User.findByIdAndUpdate(doc.creator, { $pull: { boards: doc.id } }, { new: true })
						.populate({
							path: 'boards',
							select: 'id title creator'
						})
						.exec()
						.then(user => user.toObject());
		});
	},

	getBoard(boardId) {
		return Board.findById(boardId)
					.populate({
						path: 'columns',
						select: 'id title cards',
						populate: {
							path: 'cards',
							select: 'id title done assignee board column'
						}
					})
					.exec()
					.then(board => {
						if (!board) {
							return Promise.reject(404);
						}

						return board.toObject();
					});
	},

	addColumn(columnTitle, boardId) {
		const newColumn = new Column({
			title: columnTitle,
			board: boardId
		});

		return newColumn.save().then(column => {
			return Board.findByIdAndUpdate(boardId, { $push: { columns: column.id } }, { new: true })
						.populate({
							path: 'columns',
							select: 'id title cards',
							populate: {
								path: 'cards',
								select: 'id title done assignee board column'
							}
						})
						.exec()
						.then(board => {
							if (!board) {
								return Promise.reject(404);
							}

							return board.toObject();
						});
		});
	},

	deleteColumn(columnId) {
		return Column.findByIdAndRemove(columnId).then(doc => {
			return Board.findByIdAndUpdate(doc.board, { $pull: { boards: doc.id } }, { new: true })
						.populate({
							path: 'columns',
							select: 'id title cards',
							populate: {
								path: 'cards',
								select: 'id title done assignee board column'
							}
						})
						.exec()
						.then(board => board.toObject());
		});
	},

	addCard(title, columnId, boardId) {
		const newCard = new Card({
			title,
			board: boardId,
			column: columnId
		});

		return newCard.save().then(card => {
			return Column.findByIdAndUpdate(columnId, { $push: { cards: card.id } })
					.exec()
					.then(column => {
						return Board.findById(boardId)
								.populate({
									path: 'columns',
									select: 'id title cards',
									populate: {
										path: 'cards',
										select: 'id title done assignee board column'
									}
								})
								.exec()
								.then(board => board.toObject());
					});
		});
	}
}

module.exports = BoardDao;
