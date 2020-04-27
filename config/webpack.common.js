const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('./excludeAssets')

module.exports = {
    entry:{
        /**
         * add vendor.js in src/js for add vendor script
         * add bootstrap.scss in src/scss/ for add css bootststrap
         * remember to remove relative comment
         */
        main:"./src/js/main.js",
        //vendor:"./src/js/vendor.js",
        //bootstrap:"./src/scss/vendor/bootstrap.scss"
    },
    module:{
        rules:[
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            },
            {
                test: /\.(svg|png|jpe?g|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                    options:{
                        name:'[name]-[hash:8].[ext]',
                        outputPath:"images"
                    }
                  },
                ],
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:"./src/index.html",
            filename:"index.html",
            excludeAssets:[/bootstrap-.*-bundle\.js$/]
        }),
        /**
         * for activate multi page copy above HtmlWebpackPlugin and
         * modify with your appropriate names
         * remember to remove relative comment
         * like a this example:
         * new HtmlWebpackPlugin({
            template:"./src/item.html",
            filename:"item.html",
            chunks:["vendor","bootstrap"]
            }),
         * ----------------------
         * add
         * new HtmlWebpackExcludeAssetsPlugin()
         * if you want remove not needed assets js
         * next add 
         * excludeAssets:[/bootstrap-.*-bundle\.js$/]
         * inside HtmlWebpackPlugin properties 
        */
    ]
}