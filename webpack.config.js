var path = require('path');
var u = require('underscore');
var fs = require('fs');

module.exports = {
    entry: {
        'main.js': ['./src/main.js'],
        'test/main.js': './test/main.js'
    },
    output: {
        path: __dirname,
        filename: './dist/[name]'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            // include: [
            //     path.resolve(__dirname, 'src'),
            //     path.resolve(__dirname, 'test'),
            //     path.resolve(__dirname, 'node_modules')
            // ],
            exclude: [
                /vtpl/
            ],
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }],
        resolve: {
            extensions: ['', '.js']
        }
    },
    externals: [
        function (context, request, callback) {

            var realPath = {
                'mini-event/EventTarget': 'mini-event/src/EventTarget.js',
                'mini-event/EventQueue': 'mini-event/src/EventQueue.js',
                'mini-event': 'mini-event/src/main.js'
            }[request];

            if (realPath) {
                var content = fs.readFileSync(path.join(__dirname, 'node_modules', realPath)).toString();
                return callback(null, content);
            }

            callback();
        }
    ]
};
