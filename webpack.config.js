const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

if(process.env['APP_TSX_TARGET'] === 'web') {
    plugins.push(new webpack.IgnorePlugin(/electron/));
}

const appConfig = {
    entry: ['./src/App.tsx'],
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    target: process.env.IS_WEB === 'true' ? 'web' : 'electron',
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
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },

            // {
            //     test: /\.scss$/,
            //     use: ExtractTextPlugin.extract({
            //         fallback: 'style-loader',
            //         use: ['css-loader', 'postcss-loader', 'sass-loader']
            //     })
            // },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'file-loader?publicPath=../&outputPath=font/' }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: __dirname,
            verbose: true
        }),
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'src'),
            to: path.join(__dirname, 'dist'),
            ignore: ['*.tsx', '*.ts', '*.scss', '*.ttf']
        }]),
        new ExtractTextPlugin('css/style.css'),
    ],

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those distraries between builds.
    // externals: {
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // },
};

const electronConfig = {
    entry: './src/Main.ts',
    output: {
        path: __dirname + '/dist',
        filename: 'main.js',
        devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    target: 'electron',
    node: {
        __dirname: false,
        __filename: false,
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js', 'tsx'],
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


module.exports = [appConfig, electronConfig];
