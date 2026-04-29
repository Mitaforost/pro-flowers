const { src, dest } = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const path = require('../config/path.js');

const js = () => {
    return src(path.js.src)
        .pipe(plumber({
            errorHandler: notify.onError(error => ({
                title: 'JavaScript',
                message: error.message
            }))
        }))
        .pipe(webpack({
            mode: 'development',
            output: {
                filename: 'index.js'
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(dest(path.js.dest))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(path.js.dest));
};

module.exports = js;
