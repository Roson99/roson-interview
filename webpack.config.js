/*
 * @Description  : webpack config
 * @Author       : Roson
 * @Date         : 2022-04-02 14:58:58
 * @LastEditors  : Roson
 * @LastEditTime : 2022-04-07 14:31:52
 */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const dotenv = require("dotenv");

dotenv.config();

const config = () => {
  console.log("@@ 执行一些内容后...", process.env.PORT);
  const { PORT } = process.env;
  return {
    entry: {
      main: "./src/index.js",
    },
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
      port: PORT,
      host: "my.baifubao.com",
      static: path.resolve(__dirname, "dist"),
      proxy: {
        "/api": {
          target: "https://www.baifubao.com",
          changeOrigin: true,
          secure: false,
          logLevel: "debug",
          pathRewrite: { "^/api": "" },
        },
      },
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "roson.js",
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "任",
        template: "index.html",
        filename: "roson.html",
      }),
    ],
  };
};

module.exports = config();
