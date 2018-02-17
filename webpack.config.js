const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

plugins = [
  new CleanWebpackPlugin(['dist'], {
    root: __dirname,
    verbose: true
  }),
  new CopyWebpackPlugin([{
    from: path.join(__dirname, 'src'),
    to: path.join(__dirname, 'dist'),
    ignore: ['*.tsx', '*.ts', '*.scss']
  }, {
    from: path.join(__dirname, 'node_modules/semantic-ui-css'),
    to: path.join(__dirname, 'dist/semantic-ui-css'),
  }]),
  new ExtractTextPlugin('css/style.css'),
  new webpack.DefinePlugin({
    __IS_WEB__: JSON.stringify(process.env.IS_WEB === 'true')
  }),
];
if (process.env.IS_WEB === 'true') {
  plugins.push(new webpack.IgnorePlugin(/(electron|dict-parser|fs-extra|node-stream-zip)/));
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
      {test: /\.tsx?$/, loader: "awesome-typescript-loader"},

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {enforce: "pre", test: /\.js$/, loader: "source-map-loader"},

      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },

      {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'file-loader?publicPath=../&outputPath=font/'}
    ]
  },
  plugins: plugins,
  externals: {
    sqlite: 'commonjs sqlite'
  }
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
      {test: /\.tsx?$/, loader: "awesome-typescript-loader"},

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {enforce: "pre", test: /\.js$/, loader: "source-map-loader"},
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __IS_WEB__: JSON.stringify(process.env.IS_WEB === 'true')
    })
  ],
  externals: {
    sqlite3: 'commonjs sqlite3'
  }
};

const testConfig = {
  entry: ['./src/Test.ts'],
  output: {
    path: __dirname + '/dist',
    filename: 'Test.js',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.js', '.json']
  },

  module: {
    rules: [

      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {test: /\.ts$/, loader: "awesome-typescript-loader"},

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {enforce: "pre", test: /\.js$/, loader: "source-map-loader"},
    ]
  },
  plugins: plugins,
  externals: {
    sqlite: 'commonjs sqlite'
  }
};

module.exports = [appConfig, electronConfig];
// module.exports = testConfig;