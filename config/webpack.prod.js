const path = require('path');
const common = require("./webpack.common");
const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
module.exports = merge(common, {
        mode:"production",
        output:{
            filename:"[name]-[contentHash]-bundle.js",
            path:path.resolve(__dirname,"../dist")
        },
        optimization: {
            minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin()],
        },
        module:{
            rules:[
                {
                    test: /\.s[ac]ss$/i,
                    use:[
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader',
                    ]
                },
            ]
        },
        plugins:[
            new MiniCssExtractPlugin({
                filename:"[name]-[contentHash].css"
            }),
            new CleanWebpackPlugin(),
            new RemovePlugin({
                after: {
                    test: [
                        {
                            folder: 'dist',
                            method: (absoluteItemPath) => {
                                return new RegExp(/bootstrap-.*-bundle\.js$/, 'm').test(absoluteItemPath);
                            },
                        }
                    ]
                }
            })
        ]
    }
)