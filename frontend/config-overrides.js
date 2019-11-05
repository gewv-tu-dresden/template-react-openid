const {
  override,
  fixBabelImports,
  addWebpackPlugin
} = require("customize-cra");
const webpack = require("webpack");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: "css"
  }),
  addWebpackPlugin(
    new webpack.EnvironmentPlugin([
      "OAUTH_CLIENT_AUTHORITY",
      "OAUTH_CLIENT_ID",
      "OAUTH_CLIENT_SECRET"
    ])
  )
);
