const pkg = require('./package.json')
const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const del = require('del')
const through2 = require('through2')
const markdownlint = require('markdownlint')

function clean () {
  return del('{dist,docs}')
}

function mdlint () {
  return gulp.src('./*.md')
    .pipe(through2.obj((file, enc, next) => {
      markdownlint(
        { files: [ file.relative ] },
        (err, result) => {
          const resultString = (result || '').toString()
          if (resultString) {
            console.log(resultString)
          }
          next(err, file)
        })
    }))
}

function jslint () {
  return gulp.src(['./*.js', '{src,test}/**/*.js'])
    .pipe(plugins.eslint({
      useEslintrc: true
    }))
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError())
}

function js () {
  return gulp.src('src/**/*.js')
    .pipe(plugins.replace(/@@pkg\.([a-zA-Z0-9_]+)/g, (match, p1) => pkg[p1]))
    .pipe(gulp.dest('dist'))
}

function jsdoc () {
  return gulp.src(['README.md', 'dist/**/*.js'], {
    read: false
  })
    .pipe(plugins.jsdoc3())
}

function test () {
  return gulp.src('test/**/*.js', { read: false })
    .pipe(plugins.mocha({
      reporter: 'list',
      timeout: 10000
    }))
    .on('error', plugins.util.log)
}

exports.clean = clean
exports.lint = gulp.parallel(mdlint, jslint)
exports.compile = js
exports.doc = jsdoc
exports.test = test
exports.default = gulp.series(exports.lint, exports.compile, exports.test, exports.doc)
exports.watch = () => {
  gulp.watch(['./*', 'src/**/*'], gulp.task('compile'))
}
