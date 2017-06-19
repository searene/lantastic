const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
    entry: ["./src/main.ts", "./src/sass/style.scss"],
    output: {
        filename: "main.js",
        path: __dirname + "/lib"
    },
    target: 'electron-main',
    node: {
        __dirname: false,
        __filename: false
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
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

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        'request': 'request'
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
