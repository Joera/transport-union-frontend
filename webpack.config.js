// Generated using webpack-cli https://github.com/webpack/webpack-cli

const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: "./src/main.controller.ts",
  output: {
    path: path.resolve(__dirname, "public/"),
    chunkFilename: 'scripts.js',
    filename: 'scripts.js',
    assetModuleFilename: (pathData) => {
      const filepath = path
          .dirname(pathData.filename)
          .split("/")
          .slice(1)
          .join("/");
      return `./styling/${filepath}/[name].[hash][ext][query]`;
    },
  },
  devServer: {
    open:true,
    port: 3000,
    hot: true,
    client: {
      overlay: true,
      progress: true,
      reconnect: true,
    },
  },
  devtool:'source-map',
  plugins: [
      new MiniCssExtractPlugin({
        filename: "./styling/main.scss"
      }),
      new CopyWebpackPlugin({
        patterns: [
            { from: 'static' }
        ]
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset/resource",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".ts",".js"],
    fallback: { 
      "buffer": require.resolve("buffer/") ,
      "crypto": require.resolve("crypto-browserify")
    }
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
