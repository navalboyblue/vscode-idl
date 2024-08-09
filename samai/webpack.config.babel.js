import path from 'path';
import webpack from 'webpack';

export default () => ({
    entry: {
        samai: './index.js',
        'samai.web': './index.web.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'Samai'
    },
    externals: {
        'svg.js': {
            commonjs: 'svg.js',
            commonjs2: 'svg.js',
            amd: 'svg.js',
            root: 'SVG'
        }
    },
    module: {
        rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.web\.js$/,
            minimize: true
        })
    ]
});
