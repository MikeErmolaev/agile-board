'use strict';

const Board = require('./board.model');
const User = require('../User/user.model');
const Column = require('../Column/column.model');
const Card = require('../Card/card.model');
const mongoose = require('mongoose');
const { populateQueries } = require('../../utils/model.utils');

const BoardDao = {
	saveBoard(title, creator) {
		const newBoard = new Board({
			title,
			creator: creator,
			users: [creator]
		});

		return newBoard.save().then(board => {
			return User.findByIdAndUpdate(creator, { $push: { boards: board.id } }, { new: true })
						.populate(populateQueries.USER)
						.exec()
						.then(user => user.toObject(), err => { throw err });
		});
	},

	deleteBoard(boardId) {
		return Board.findByIdAndRemove(boardId).then(doc => {
			return User.findByIdAndUpdate(doc.creator, { $pull: { boards: doc.id } }, { new: true })
						.populate(populateQueries.USER)
						.exec()
						.then(user => user.toObject(), err => { throw err });
		});
	},

	getBoard(boardId) {
		return Board.findById(boardId)
					.populate(populateQueries.BOARD)
					.exec()
					.then(board => {
						if (!board) {
							return Promise.reject(404);
						}

						return board.toObject();
					}, err => { throw err });
	},

	addColumn(columnTitle, boardId) {
		const newColumn = new Column({
			title: columnTitle,
			board: boardId
		});

		return newColumn.save().then(column => {
			return Board.findByIdAndUpdate(boardId, { $push: { columns: column.id } }, { new: true })
						.populate(populateQueries.BOARD)
						.exec()
						.then(board => {
							if (!board) {
								return Promise.reject(404);
							}

							return board.toObject();
						}, err => { throw err });
		});
	},

	deleteColumn(columnId) {
		return Column.findByIdAndRemove(columnId).then(doc => {
			return Board.findByIdAndUpdate(doc.board, { $pull: { boards: doc.id } }, { new: true })
						.populate(populateQueries.BOARD)
						.exec()
						.then(board => board.toObject(), err => { throw err });
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
						.then(column => Board.findById(boardId)
										.populate(populateQueries.BOARD)
										.exec()
										.then(board => board.toObject(), err => { throw err }));
		});
	},

	toggleCardState(cardId, newState) {
		return Card.findByIdAndUpdate(cardId, { $set: { done: newState }})
					.then(card => Board.findById(card.board)
										.populate(populateQueries.BOARD)
										.exec()
										.then(board => board.toObject(), err => { throw err }));
	},

	deleteCard(cardId) {
		return Card.findByIdAndRemove(cardId)
					.then(card => Board.findById(card.board)
										.populate(populateQueries.BOARD)
										.exec()
										.then(board => board.toObject(), err => { throw err }));
	},

	moveToColumn(cardId, columnId) {
		return Card.findByIdAndUpdate(cardId, { $set: { column: columnId } })
					.then(card => Column.findByIdAndUpdate(card.column, { $pull: { cards: cardId } }))
					.then(column => Column.findByIdAndUpdate(columnId, { $push: { cards: cardId } }))
					.then(column => Board.findById(column.board)
										.populate(populateQueries.BOARD)
										.exec()
										.then(board => board.toObject(), err => { throw err }));
	}
}

module.exports = BoardDao;
