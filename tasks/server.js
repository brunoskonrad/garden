const gulp = require('gulp')
const webserver = require('gulp-webserver')
const notify = require('gulp-notify')

const paths = require('./paths')

const config = {
  livereload: true,
  port: 3000,
  open: true
}

module.exports = () => {
  return gulp.src(paths.public)
    .pipe(webserver(config))
    .pipe(notify('Docs up'))
}
