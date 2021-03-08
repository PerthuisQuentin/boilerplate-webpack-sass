const Path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require("terser-webpack-plugin")

const rules = [
	{
		test: /\.jsx?$/,
		loader: 'babel-loader',
	},
	{
		test: /\.scss$/,
		use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
        ]
	}
]

const resolvePath = path => Path.resolve(__dirname, path)

const entryPath = resolvePath('src/main.js')
const publicPath = resolvePath('public')

const getBaseConfig = {
	target: 'web',
    entry: entryPath,
	output: {
        path: publicPath,
        filename: 'bundle.js'
    },
	module: {
		rules
	},
    plugins: [new MiniCssExtractPlugin({
        filename: 'bundle.css'
    })],
	resolve: {
		modules: ['src', 'node_modules'],
		extensions: ['.js', '.scss']
	},
	performance: {
		hints: false
	},
}

module.exports = (env, argv) => {
	const mode = argv.mode || process.env.NODE_ENV || 'development'
	const isProd = mode === 'production'

	// Production
	if (isProd) {
		return {
			...getBaseConfig,
			mode: 'production',
			devtool: false,
            optimization: {
                minimize: true,
                minimizer: [new TerserPlugin()],
            },
		}

	// Development
	} else {
		return {
			...getBaseConfig,
			mode: 'development',
			devtool: 'eval',
			devServer: {
				contentBase: publicPath,
				compress: true,
				port: 8000,
			},
		}
	}
}
