/**
 * Dependencies
 */
const webpack 					= require('webpack'),
	  path 						= require('path'),
	  ExtractTextPlugin 		= require('extract-text-webpack-plugin'),
	  OptimizeCssAssetsPlugin 	= require('optimize-css-assets-webpack-plugin'),
	  autoprefixer 				= require('autoprefixer'),
	  dev						= process.env.NODE_ENV === 'dev';

let root = path.resolve( __dirname );

//var extractCSS = new ExtractTextPlugin('style.css');

let config = {
	entry: {
		app: ['./assets/css/style.scss', './assets/js/app.js']
	},
	output: {
		path: path.resolve( __dirname, './assets/js' ),
		filename: 'scripts.js'
	},
	devtool: dev ? 'cheap-module-eval-source-map' : 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				include: root,
				use: ['babel-loader']
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [ 'css-loader?importLoaders=1', 'postcss-loader', 'resolve-url-loader' ]
				}),
			},
			{
		      	test: /\.(sass|scss)$/,
		      	loader: ExtractTextPlugin.extract([
		      		'css-loader',
		      		'sass-loader'
		      	])
		    },
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				use: ['url-loader?limit=100000']
			}
		]
	},
	plugins: [
		/**
		 * Styles
		 */
		
		new webpack.LoaderOptionsPlugin({
			options: {
				postcss: [
					autoprefixer({
						add: true,
						browsers: [
							'last 2 versions',
							'ie >= 9',
							'Firefox ESR'
						],
					}),
				],
			}
		}),
		
		// style.css
		new ExtractTextPlugin({
			filename: './../css/style.css',
			allChunks: true,
		}),
		// new webpack.optimize.UglifyJsPlugin({
		// 	comments: false
		// });
	]
}

/**
 * Production
 */
if(!dev) {
	/**
	 * Styles
	 */
	
	// style.min.css
	config.plugins.push( new ExtractTextPlugin({
		filename: './../css/style.min.css',
		allChunks: true,
	}));
	
	// Minify style.min.css
	config.plugins.push( new OptimizeCssAssetsPlugin({
	    assetNameRegExp: /\.min\.css$/,
	    cssProcessorOptions: {
	    	discardComments: {
	    		removeAll: true
	    	}
	    }
	}));
	
	/**
	 * Scripts
	 */
	config.plugins.push( new webpack.optimize.UglifyJsPlugin({
		sourceMap: true
	}));
}

module.exports = config;