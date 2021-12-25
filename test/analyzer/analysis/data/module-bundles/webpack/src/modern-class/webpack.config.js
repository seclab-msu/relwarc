module.exports = {
    optimization: {
        concatenateModules: false
    },
    context: __dirname + '/src',
    entry: "./_start.js",
    output: {
        path: __dirname,
        filename: "webpack-test.js"
    },
    //devtool: "source-map",
    //mode: "development"
    target: "es6",
    mode: "production",
    module: {
        rules: [{
            // Only run `.js` files through Babel
            test: /.*/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/preset-env', {targets: "Chrome 70"}]]
                }
            }
        }]
    }
};
