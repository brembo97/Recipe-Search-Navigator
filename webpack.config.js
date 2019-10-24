const path = require('path');

module.exports = {
    entry: './src/js/index.js',
    output:{
        //Absolute Path
        path: path.resolve(__dirname,"dist/js"),
        filename:'bundle.js'
    },
    mode: 'development'

}