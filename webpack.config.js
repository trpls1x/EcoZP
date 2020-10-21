var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    //...
    context: path.resolve(__dirname, 'src'),
    entry: './main.js',
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
            rules: [
            // ... other rules
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    use: ['file-loader','image-webpack-loader'],
                    
                }
            ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        compress: true,
        port: 8080
  }
};
