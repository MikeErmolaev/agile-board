'use strict';

const https = require('https');
const express = require('express');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const routes = require('./routes/');
const fs = require('fs');
const key = fs.readFileSync(`${__dirname}/sparky-key.pem`);
const cert = fs.readFileSync(`${__dirname}/sparky-cert.pem`);

const options = {
	key,
	cert
};

const app = express();

app.use(logger('dev'));
app.use(errorHandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.all('/favicon.ico', (req, res) => {
	res.status(200).end();
});

app.use(routes);

app.set('port', process.env.PORT || 3000);

const server = https.createServer(options, app).listen(app.get('port'), () => {
	console.log(`Express server listening on port ${server.address().port}`);
});

module.exports = server;
