'use strict';
const errorMessages = require('../constants/errors');
const config = require('../config.js');
const jwt = require('../utils/jwt.js');
const UserDao = require('../models/User');
const BoardDao = require('../models/Board');

const protectedMiddlewares = {
	validateToken(req, res, next) {
		const token = req.get('Authorization');

		if (!token) {
			const error = new Error(errorMessages.WRONG_TOKEN);
			error.status = 401;
			next(error);
			return;
		}

		const parsedToken = token.split(' ');
		if (parsedToken.length !== 2 || parsedToken[0] !== 'Bearer') {
			const error = new Error(errorMessages.WRONG_TOKEN);
			error.status = 401;
			next(error);
			return;
		} else {
			let decodedToken;
			
			try {
				decodedToken = jwt.decodeToken(parsedToken[1], config.secret);
			} catch(err) {
				const error = new Error(errorMessages.WRONG_TOKEN);
				error.status = 401;
				next(error);
				return;
			}

			if (!decodedToken.sub) {
				const error = new Error(errorMessages.WRONG_TOKEN);
				error.status = 401;
				next(error);
				return;
			}
			req.decodedToken = decodedToken;
			console.log('TOKEN is OK');
			next();
		}
	},

	authorizeUser(req, res, next) {
		console.log('Authorizing..');
		UserDao.getUserById(req.decodedToken.sub).then(user => {
			sendUser(res, user)
		}, res.sendStatus.bind(res)).catch(next);
	},

	addBoard(req, res, next) {
		const { title, team } = req.body;

		if (!title) {
			return res.sendStatus(400);
		}

		BoardDao.saveBoard(title, req.decodedToken.sub).then(user => {
			sendUser(res, user);
		}).catch(next);
	},

	deleteBoard(req, res, next) {
		const { boardId } = req.params;

		if (!boardId) {
			return res.sendStatus(400);
		}

		BoardDao.deleteBoard(boardId).then(user => {
			sendUser(res, user);
		}).catch(next);	
	},

	getBoard(req, res, next) {
		const { boardId } = req.params;

		if (!boardId) {
			return res.sendStatus(400);
		}

		BoardDao.getBoard(boardId).then(board => {
			sendBoard(res, board);
		}, res.sendStatus.bind(res)).catch(next);
	},

	addColumn(req, res, next) {
		const { columnTitle, boardId } = req.body;

		if (!columnTitle || !boardId) {
			return res.sendStatus(400);
		}

		BoardDao.addColumn(columnTitle, boardId).then(board => {
			sendBoard(res, board);
		}, res.sendStatus.bind(res)).catch(next);
	},

	deleteColumn(req, res, next) {
		const { columnId } = req.params;

		if (!columnId) {
			return res.sendStatus(400);
		}

		BoardDao.deleteColumn(columnId).then(board => {
			sendBoard(res, board);
		}, res.sendStatus.bind(res)).catch(next);
	},

	addCard(req, res, next) {
		const { title, columnId, boardId } = req.body;

		console.log(req.body);

		if (!title || !columnId || !boardId) {
			return res.sendStatus(400);
		}

		BoardDao.addCard(title, columnId, boardId).then(board => {
			sendBoard(res, board);
		}, res.sendStatus.bind(res)).catch(next);
	}
}

function sendUser(res, user) {
	res.send({
		data: {
			success: true,
			user
		}
	});
}

function sendBoard(res, board) {
	res.send({
		data: {
			success: true,
			board
		}
	});
}

module.exports = protectedMiddlewares;
