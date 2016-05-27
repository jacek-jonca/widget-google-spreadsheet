var webpack = require("webpack"),
  HTMLWebPackPlugin = require("html-webpack-plugin"),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  env = process.env.NODE_ENV || "prod",
  plugins = [
    new HTMLWebPackPlugin({
      template: __dirname + "/src/widget.html",
      filename: "widget.html",
      inject: "body"
    }),
    new ExtractTextPlugin("css/spreadsheet.css", { allChunks: false })
  ];

// Minify for Production only.
if (env === "prod") {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );
}

module.exports = {
  entry: [
    "./src/components/widget-common/dist/common.js",
    "./src/components/widget-common/dist/logger.js",
    "./src/components/widget-common/dist/message.js",
    "./src/config/config.js",
    "./src/widget/main.js",
    "./src/widget/analytics.js"
  ],
  devtool: "source-map",
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        include: /src\/widget/,
        loaders: ["eslint"]
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        include: [/src\/widget/, /test\/unit\/widget/],
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        test: require.resolve(__dirname + "/src/components/widget-common/dist/logger"),
        loader: "imports?WIDGET_COMMON_CONFIG=./config"
      },
      {
        test: require.resolve(__dirname + "/src/components/widget-common/dist/config"),
        loader: "exports?WIDGET_COMMON_CONFIG"
      },
      {
        test: require.resolve(__dirname + "/src/components/widget-common/dist/logger"),
        loader: "exports?RiseVision.Common.LoggerUtils"
      },
      {
        test: require.resolve(__dirname + "/src/components/widget-common/dist/message"),
        loader: "exports?RiseVision.Common.Message"
      },
      {
        test: require.resolve(__dirname + "/src/components/widget-common/dist/common"),
        loader: "exports?RiseVision.Common.Utilities"
      }
    ]
  },
  eslint: {
    failOnError: true
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  output: {
    path: __dirname + "/dist",
    filename: "js/widget.min.js"
  },
  externals: {
    "cheerio": "window",
    "react/lib/ExecutionEnvironment": true,
    "react/lib/ReactContext": true
  },
  plugins: plugins
};