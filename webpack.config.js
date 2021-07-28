const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev';

const dirApp = path.join(__dirname, 'app');
const dirAssets = path.join(__dirname, 'assets');
const dirStyles = path.join(__dirname, 'styles');
const dirNode = 'node_modules';

module.exports = {
	entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'index.scss')],
	resolve: { modules: [dirApp, dirAssets, dirStyles, dirNode] },
	plugins: [
		new webpack.DefinePlugin({ IS_DEVELOPMENT }),
		new CopyWebpackPlugin({ patterns: [{ from: './assets', to: '' }] }),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
	],
	module: {
		rules: [
			{
				test: /.js$/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '',
						},
					},
					{
						loader: 'css-loader',
					},
				],
			},
		],
	},
};
