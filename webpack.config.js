const webpack = require ('webpack');
const path = require('path');

module.exports = {
	devtool: "source-map",
	entry: path.join(__dirname, 'src', 'routes.js'),
	output: {
		devtoolLineToLine: true,
		sourceMapFileName: './bundle.js.map',
		path: path.join(__dirname, 'src', 'static'),
		filename: 'bundle.js'
		},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /(node_mdules)/,
			loader: 'babel-loader',
			query: {
				presets: ['react', 'es2015', 'stage-2']
			}
		}]
	},
	plugins: [
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