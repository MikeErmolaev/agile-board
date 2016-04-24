'use strict';
const path = require('path');
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const rimraf = require('rimraf');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = {
	resolve: {
		moduleDirectories: ['node_modules'],
		extensions: ['', '.ts', '.js', 'styl']
	},

	resolveLoader: {
		moduleDirectories: ['node_modules'],
		moduleTemplates: ['*-loader', '*'],
		extensions: ['', '.js']
	},

	devtool: 'cheap-module-eval-source-map',

	module: {
		noParse: [
			/dist/,
			/bundles/
		],
		loaders: [{
			test: /\.ts$/,
			exclude: /\/node_modules\//,
			loader: 'ts'
		}, {
			test: /\.styl$/,
			exclude: /\/node_modules\//,
			loader: ExtractTextPlugin.extract('style', 'css!stylus?resolve url')
		}, {
			test: /\.css$/,
			exclude: /\/node_modules\//,
			loader: ExtractTextPlugin.extract('style', 'css')
		}, {
			test: /\.(png|svg|ttf)$/,
			loader: 'file?name=[path][name].[ext]'
		}]
	},

	output: {
		filename: 'bundle.js'
	},

	plugins: [
		{
			apply: compiler => {
				rimraf.sync(compiler.options.output.path);
			}
		},
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			minChunks: Infinity
		}),
		new ExtractTextPlugin('[name].css')
	],

	devServer: {
		host: 'localhost',
		port: 3001
	}
};

const clientConfig = {
	target: 'web',
	entry: {
		main: './client/main',
		vendor: [
			'./node_modules/es6-shim/es6-shim.min',
			'./node_modules/systemjs/dist/system-polyfills',
			'./node_modules/angular2/bundles/angular2-polyfills',
			'./node_modules/systemjs/dist/system.src',
			'./node_modules/rxjs/bundles/Rx.min',
			'./node_modules/angular2/bundles/angular2.dev.js',
			'./node_modules/angular2/bundles/router.dev.js'
		]
	},
	resolve: {
		root: path.resolve('./client/')
	},
	output: {
		path: path.join(__dirname, 'dist', 'client'),
		filename: '[name].js',
		chunkfilename: '[id].js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'index.ejs',
			inject: false
		})
	]
};

const serverConfig = {
	target: 'node',
	entry: './server',
	resolve: {
		root: path.resolve('./server')
	},
	output: {
		path: path.join(__dirname, 'dist', 'server')
	},
	externals: checkNodeImport
};

module.exports = [
	webpackMerge(commonConfig, clientConfig),

	webpackMerge(commonConfig, serverConfig)
];


function checkNodeImport(context, request, cb) {
	if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
		cb(null, 'commonjs ' + request); return;
	}
	cb();
}