'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('supertest');
const generateToken = require('../utils/jwt.js').generateToken;
const decodeToken = require('../utils/jwt.js').decodeToken;
const errorMessages = require('../constants/errors.js');
const config = require('../config.js');
const _ = require('lodash');

describe('Server', function() {
	let server;
	beforeEach('initialize server', function() {
		server = require('../');
	});
	afterEach('close server', function() {
		server.close();
	});
	describe('#routes', function() {
		describe('## \'/\'', function() {
			it('should get status 200', function(done) {
				request(server)
					.get('/')
					.expect('Content-Type', 'text/html')
					.expect(200, done);
			});
		});
		/*describe('## \'/login\'', () => {
			it('should response with status 401 if no username or password are sended', function(done) {
				request(server)
					.post('/login')
					.expect(401, done);
			});
			it('should response with status 401 if unknown username or pass are sended', function(done) {
				request(server)
					.post('/login')
					.send({ username: 'tobi', password: 'pass' })
					.expect(401, done);
			});
			it('should response with token if correct credentials are passed', function(done) {
				request(server)
					.post('/login')
					.send({ username: 'spark4304@gmail.com', password: 'jeki123' })
					.expect(res => {
						expect(res.body.token).to.be.a('string');
					})
					.end(done);

			});
		});*/
		
	});
});

describe('Utils', function() {
	describe('auth', () => {
		describe('#generateToken', () => {
			it('should throw if wrong or no argument is passed', function() {
				expect(generateToken).to.throw('Payload argument should be object');
				expect(generateToken).to.throw('Payload argument should be object');
			});
			it('should return encoded string', function() {
				expect(generateToken({  iss:'mike@gmail.com' })).to.be.a('string');
			});
		});
		describe('#decodeToken', () => {
			it('should throw error if wrong token argument was passed in', function() {
				expect(decodeToken).to.throw('Token argument should be string');
			});
			it('should return object equal to encoded payload', function() {
				const payload = { exp: Date.now(), iss: 'test' };
				const token = generateToken(payload);
				expect(decodeToken(token)).to.be.deep.equal(payload);
			});
		});
				
	});
});

describe('Middlewares', function() {
	describe('validate-token', function() {
		const validateToken = require('../middlewares/validate-token.js');
		let req, res, next, db, error;
		beforeEach('predefine req, res, db, next', function() {
			req = {
				headers: {

				},
				body: {

				},

				get(header) {
					return req.headers[header];
				}
			};

			res = {};

			next = sinon.spy();

			db = {
				users: [{
					email: 'spark4304@gmail.com'
				}]
			};
			db.users.findOne = (query, cb) => {
				const isInDatabase = _.some(db.users, user => {
					return user.email === query.email;
				});

				isInDatabase ? cb(null, {}) : cb(new Error('Not found'));
			};

			error = new Error(errorMessages.WRONG_TOKEN);
			error.status = 401;
		});
		it('should pass error to next callback if no token was passed via Authorization header', sinon.test(function() {
			validateToken(db, req, res, next);

			sinon.assert.calledWith(next, error);
		}));
		it('should pass error to next callback if wrong token was passed via Authorization header', function() {
			req.headers.Authorization = '34fgfsdf2rsdgsdf';

			validateToken(db, req, res, next);

			sinon.assert.calledWith(next, error);
			next.reset();

			req.headers.Authorization = 'Basic 34fgfsdf2rsdgsdf';

			validateToken(db, req, res, next);

			sinon.assert.calledWith(next, error);
		});
		it('should go to the next middleware if token is correct', function() {
			const token = generateToken({ sub: 'spark4304@gmail.com' }, config.secret);

			req.headers.Authorization = `Bearer ${token}`;

			validateToken(db, req, res, next);
			expect(next.args[0]).to.be.empty;
			sinon.assert.calledOnce(next);
		});
	});
});
