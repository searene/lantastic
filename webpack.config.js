const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const electronConfig = {
    entry: './src/Main.ts',
    output: {
        path: __dirname + '/lib',
        filename: 'main.js',
    },
    target: 'electron-main',
    node: {
        __dirname: false,
        __filename: false,
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
        ]
    }
};

const appConfig = {
    entry: ['./src/App.tsx', './src/sass/style.scss'],
    output: {
        path: __dirname + '/lib',
        filename: 'bundle.js',
    },
    node: {
        __dirname: false,
        __filename: false,
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader', 'sass-loader']
                })
            },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'file-loader?publicPath=../&outputPath=font/' }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(['lib'], {
            root: __dirname,
            verbose: true
        }),
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'src'),
            to: path.join(__dirname, 'lib'),
            ignore: ['*.tsx', '*.ts', '*.scss', '*.ttf']
        }]),
        new ExtractTextPlugin('css/style.css'),
    ]
};

module.exports = [appConfig, electronConfig];
