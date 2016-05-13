'use strict';

/*
	Uncomment lines and generate certificate and key files to enable https
*/

/*const https = require('https');
const fs = require('fs');*/
const express = require('express');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const routes = require('./routes/');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/agile-board');

const db = mongoose.connection;

db.once('open', () => console.log('[DB]: Connected'))
	.on('error', err => console.log(err.message))
	.on('disconnected', () => console.log('[DB: Disconnected'));

/*const key = fs.readFileSync(`${__dirname}/sparky-key.pem`);
const cert = fs.readFileSync(`${__dirname}/sparky-cert.pem`);

const options = {
	key,
	cert
};*/

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

console.log(`Static content is being served from ${path.resolve(__dirname, '..', 'dist', 'client')}`);

app.use(express.static(path.resolve(__dirname, '..', 'dist', 'client')));

app.all('/favicon.ico', (req, res) => {
	res.status(200).end();
});

app.use(routes);

if (process.env.NODE_ENV === 'development') {
	app.use(errorHandler());
}

app.set('port', process.env.PORT || 3000);

const server = /*https.createServer(options, app)*/app.listen(app.get('port'), () => {
	console.log(`Express server listening on port ${server.address().port}`);
});

module.exports = server;
