async = require 'async'
fs = require 'fs'

async = require 'async'
babel = require 'babel-core'
del = require 'del'
gulp = require 'gulp'
gutil = require 'gulp-util'
uglify = require 'gulp-uglify'
rename = require 'gulp-rename'
webpack = require 'webpack'

wpConfig = require('./webpack.config.js')

gulp.task 'clean', ->
  del "#{__dirname}/dist"
  del "#{__dirname}/build"

gulp.task 'build', (cb) ->
  webpackConfig = wpConfig
  webpack webpackConfig, (err, stats) ->
    throw new gutil.PluginError("Webpack", err) if err
    errors = stats.toJson().errors
    throw errors if errors.length > 0
    gutil.log "Webpack", stats.toString({colors: true})
    gulp.src("#{__dirname}/build/index.js")
      .pipe(uglify())
      .pipe(rename {suffix: '.min'})
      .pipe(gulp.dest("#{__dirname}/build"))
      .on('end', cb)

gulp.task 'examples', (cb) ->
  examples = Object.keys(wpConfig.examples)
  async.each examples, (example, eCb) ->
    webpackConfig = wpConfig.buildExamples(example)
    webpack webpackConfig, (err, stats) ->
      throw new gutil.PluginError("Webpack", err) if err
      errors = stats.toJson().errors
      throw errors if errors.length > 0
      gutil.log "Webpack", stats.toString({colors: true})
      eCb()
  , cb
