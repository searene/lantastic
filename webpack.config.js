const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

const appConfig = {
  entry: ["./src/App.tsx"],
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
    devtoolModuleFilenameTemplate: "../[resource-path]",
    pathinfo: false
  },
  target: "electron-main",
  mode: "development",
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
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        ]
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },

      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: "file-loader?publicPath=../&outputPath=font/" }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"], {
      root: __dirname,
      verbose: true
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, "src"),
        to: path.join(__dirname, "dist"),
        ignore: ["*.tsx", "*.ts", "*.scss"]
      },
      {
        from: path.join(__dirname, "node_modules/semantic-ui-css"),
        to: path.join(__dirname, "dist/semantic-ui-css")
      },
      {
        from: path.join(__dirname, "node_modules/react-select/dist/react-select.css"),
        to: path.join(__dirname, "dist/css/react-select.css")
      }
    ]),
    new ExtractTextPlugin("css/style.css")
  ],
  externals: {
    sqlite: "commonjs sqlite"
  }
};

const electronConfig = {
  entry: "./src/Main.ts",
  output: {
    path: __dirname + "/dist",
    filename: "main.js",
    devtoolModuleFilenameTemplate: "../[resource-path]",
    pathinfo: false
  },
  target: "electron-main",
  mode: "development",
  node: {
    __dirname: false,
    __filename: false
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        ]
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  externals: {
    sqlite3: "commonjs sqlite3"
  }
};

const imageSearchInjectionConfig = {
  entry: "./src/services/ImageSearchInjection.ts",
  output: {
    path: __dirname + "/dist",
    filename: "ImageSearchInjection.js",
    devtoolModuleFilenameTemplate: "../[resource-path]",
    pathinfo: false
  },
  target: "web",
  mode: "development",
  node: {
    __dirname: false,
    __filename: false
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    extensions: [".js", ".ts", ".css"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        ]
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      },

      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: "file-loader?publicPath=../&outputPath=font/" }
    ]
  }
};

const extractDictionaryScss = new ExtractTextPlugin({ filename: "css/dictionary.css" });
const dictionaryStyleConfig = {
  entry: ["./src/stylesheets/dictionaries/common.scss", "./src/stylesheets/dictionaries/dsl.scss"],
  target: "web",
  mode: "development",
  node: {
    __dirname: false,
    __filename: false
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractDictionaryScss.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        })
      }
    ]
  },
  plugins: [extractDictionaryScss]
};

const definitionWebviewPreloadConfig = {
  entry: "./src/services/DefinitionWebviewPreload.ts",
  output: {
    path: __dirname + "/dist",
    filename: "DefinitionWebviewPreload.js",
    devtoolModuleFilenameTemplate: "../[resource-path]",
    pathinfo: false
  },
  target: "web",
  mode: "development",
  node: {
    __dirname: false,
    __filename: false
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    extensions: [".js", ".ts", ".css"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        ]
      }
    ]
  },
  externals: {
    electron: "commonjs electron"
  }
};

module.exports = [
  appConfig,
  electronConfig,
  imageSearchInjectionConfig,
  dictionaryStyleConfig,
  definitionWebviewPreloadConfig
];
