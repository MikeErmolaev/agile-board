'use strict';

const router = require('express').Router();
const protectedMiddlewares = require('../middlewares/protected.middleware.js');
const UserDao = require('../models/User');
const BoardDao = require('../models/Board');

const apiPath = '/api/protected';

router.use(`${apiPath}`, protectedMiddlewares.validateToken);

router.get(`${apiPath}/authorize`, protectedMiddlewares.authorizeUser);

router.post(`${apiPath}/board/add`, protectedMiddlewares.addBoard);

router.delete(`${apiPath}/board/delete/:boardId`, protectedMiddlewares.deleteBoard);

router.get(`${apiPath}/board/:boardId`, protectedMiddlewares.getBoard);

router.post(`${apiPath}/column/add`, protectedMiddlewares.addColumn);

router.delete(`${apiPath}/column/delete/:columnId`, protectedMiddlewares.deleteColumn);

router.post(`${apiPath}/card/add`, protectedMiddlewares.addCard);

router.put(`${apiPath}/card/toggle`, protectedMiddlewares.toggleCardState);

router.delete(`${apiPath}/card/delete/:cardId`, protectedMiddlewares.deleteCard);

router.put(`${apiPath}/card/move`, protectedMiddlewares.moveToColumn);

module.exports = router;
