const { src, dest } = require('gulp')
const newer = require('gulp-newer')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')

const path = require('../config/path.js')

const font = () => {
    return src(path.font.src)
        .pipe(plumber({
            errorHandler: notify.onError(error => ({
                title: 'Font',
                message: error.message
            }))
        }))
        .pipe(newer(path.font.dest))
        .pipe(dest(path.font.dest))
}

module.exports = font
