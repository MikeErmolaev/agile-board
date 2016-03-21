'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('supertest');
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
					.expect(200, done);
			});
		});
		describe('## \'/login\'', () => {
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
		});
		
	});
});

describe('Auth util', () => {
	const generateToken = require('../utils/jwt.js').generateToken;
	const decodeToken = require('../utils/jwt.js').decodeToken;
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

