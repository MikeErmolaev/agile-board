'use strict';
const path = require('path');
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const rimraf = require('rimraf');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = {
	resolve: {
		moduleDirectories: ['node_modules'],
		extensions: ['', '.ts', '.js', 'styl']
	},

	resolveLoader: {
		moduleDirectories: ['node_modules'],
		moduleTemplates: ['*-loader', '*'],
		extensions: ['.js']
	},

	devtool: 'source-map',

	module: {
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
		new ExtractTextPlugin('[name].css')/*,
		new HtmlWebpackPlugin()*/
	],

	devServer: {
		host: 'localhost',
		port: 3001
	}
};

const clientConfig = {
	entry: './client/main',
	output: {
		path: path.join(__dirname, 'dist', 'client'),
		filename: '[name].js'
	}
};

const serverConfig = {
	entry: './server',
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