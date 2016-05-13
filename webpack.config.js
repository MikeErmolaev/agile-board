'use strict';
const path = require('path');
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const rimraf = require('rimraf');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = {
	context: __dirname,
	resolve: {
		moduleDirectories: ['node_modules'],
		extensions: ['', '.ts', '.js', 'styl', 'html']
	},

	resolveLoader: {
		moduleDirectories: ['node_modules'],
		moduleTemplates: ['*-loader', '*'],
		extensions: ['', '.js']
	},

	devtool: 'source-map',

	module: {
		noParse: [
			/systemjs\\dist/
		],
		
		loaders: [{
			test: /\.ts$/,
			exclude: /\/node_modules\//,
			loader: 'ts'
		}, {
			test: /^.*\\\w*\.styl$/,
			exclude: /\/node_modules\//,
			loader: ExtractTextPlugin.extract('style', 'css!stylus?resolve url')
		}, {
			test: /\.component\.styl$/,
			loader: 'raw!stylus?resolve url'
		}, {
			test: /\.css$/,
			exclude: /\/node_modules\//,
			loader: 'raw!css'
		}, {
			test: /\.(png|svg|ttf)$/,
			loader: 'file?name=[path][name].[ext]'
		}, {
			test: /\.html$/,
			loader: 'raw'
		}]
	},

	stylus: {
		use: [require('nib')()],
		import: ['~nib/lib/nib/index.styl']
	},

	output: {
		filename: 'bundle.js',
		path: './dist'
	},

	plugins: [
		{
			apply: compiler => {
				rimraf.sync(compiler.options.output.path);
			}
		},
		new webpack.NoErrorsPlugin(),
/*		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			minChunks: Infinity
		}),*/
		new ExtractTextPlugin('[name].css', { allChunks:true })
	],

	devServer: {
		host: 'localhost',
		port: 3001
	}
};

const clientConfig = {
	context: path.join(__dirname, 'src'),
	target: 'web',
	entry: {
		app: './main',
		vendor: [
			'../node_modules/es6-shim/es6-shim.min',
			'../node_modules/systemjs/dist/system-polyfills',
			'../node_modules/angular2/bundles/angular2-polyfills',
			'../node_modules/systemjs/dist/system.src',
			'rxjs/Rx',
			'angular2/router',
			'../node_modules/angular2/bundles/angular2.dev.js'
		]
	},
	resolve: {
		root: path.resolve('src')
	},
	output: {
		path: path.resolve(__dirname, 'dist', 'client'),
		filename: '[name].bundle.js',
		chunkfilename: '[id].js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: '../index.ejs',
			inject: false
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'vendor.bundle.js'
		})
	]
};

const serverConfig = {
	target: 'node',
	entry: path.resolve('server'),
	resolve: {
		root: path.resolve('server')
	},
	output: {
		path: path.resolve(__dirname, 'dist', 'server')
	},
	externals: checkNodeImport,
	node: {
		__dirname: true
	}
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