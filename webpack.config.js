const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev';

const dirApp = path.join(__dirname, 'app');
const dirAssets = path.join(__dirname, 'assets');
const dirImages = path.join(__dirname, 'images');
const dirStyles = path.join(__dirname, 'styles');
const dirNode = 'node_modules';
const dirVideos = path.join(__dirname, 'videos');

module.exports = {
	entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'index.scss')],
	resolve: {
		modules: [dirApp, dirAssets, dirImages, dirStyles, dirNode, dirVideos],
	},
	plugins: [
		new webpack.DefinePlugin({ IS_DEVELOPMENT }),
		new CopyWebpackPlugin({ patterns: [{ from: './assets', to: '' }] }),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new ImageMinimizerPlugin({
			minimizerOptions: {
				// Lossless optimization with custom option
				// Feel free to experiment with options for better result for you
				plugins: [
					['gifsicle', { interlaced: true }],
					['jpegtran', { progressive: true }],
					['optipng', { optimizationLevel: 4 }],
				],
			},
		}),
		new CleanWebpackPlugin(),
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
					{
						loader: 'postcss-loader',
					},
				],
			},
			{
				test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
				loader: 'file-loader',
				options: {
					name(file) {
						return '[hash].[ext]';
					},
				},
			},
			{
				test: /\.(jpe?g|png|gif|svg|webp)$/i,
				use: [
					{
						loader: ImageMinimizerPlugin.loader,
					},
				],
			},
		],
		optimization: {
			minimize: true,
			minimizer: [new TerserPlugin()],
		},
	},
};
