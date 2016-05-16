'use strict';

const router = require('express').Router();
const validateToken = require('../middlewares/validate-token.js');
const UserDao = require('../models/User');
const BoardDao = require('../models/Board');

router.use('/api/protected', validateToken);

router.get('/api/protected/authorize', (req, res, next) => {
	UserDao.getUserById(req.decodedToken.sub).then(user => {
		res.send({
			data: {
				success: true,
				user
			}
		});
	}).catch(next);
});

router.post('/api/protected/board/add', (req, res, next) => {
	const { title, team } = req.body;

	console.log(req.get('Content-Type'));

	if (!title) {
		return res.sendStatus(400);
	}

	BoardDao.saveBoard(title, req.decodedToken.sub).then(user => {
		res.send({
			data: {
				success: true,
				user
			}
		})
	}).catch(next);
});

router.post('/api/protected/board/delete', (req, res, next) => {
	const { boardId } = req.body;

	if (!boardId) {
		return res.sendStatus(400);
	}

	BoardDao.deleteBoard(boardId, req.decodedToken.sub).then(user => {
		res.send({
			data: {
				success: true,
				user
			}
		});
	}).catch(next);	
});

module.exports = router;
