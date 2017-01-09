const webpack = require ('webpack');
const path = require('path');

module.exports = {
	entry: [
	'webpack-dev-server/client?http://0.0.0.0:3000',
	'webpack/hot/only-dev-server',
	'./src/routes.js';
	],
	output: {
		path: path.join(__dirname, 'src', 'static'),
		filename: 'bundle.js'
		},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			loaders: ['react-hot', 'babel-loader'],
			include: path.join(__dirname, 'src'),
			exclude: /(node_mdules)/,
			query: {
				presets: ['react', 'es2015', 'stage-2']
			}
		}]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {warnings: false},
			mangle: true,
			sourcemap: false,
			beautify: false,
			dead_code: true
		})
	]
};