async = require 'async'
fs = require 'fs'

async = require 'async'
babel = require 'babel-core'
del = require 'del'
gulp = require 'gulp'
gutil = require 'gulp-util'
webpack = require 'webpack'
mkdirp = require 'mkdirp'

wpConfig = require('./webpack.config.js')

gulp.task 'clean', ->
  del "#{__dirname}/dist"

gulp.task 'build', (cb) ->
  mkdirp 'build', (err) ->
    return cb(err) if err

    async.parallel
      index: (pCb) ->
        babel.transformFile "#{__dirname}/src/index.jsx", {presets: ['react', 'es2015']}, (err, result) ->
          fs.writeFile 'build/index.js', result.code, pCb
      root: (pCb) ->
        babel.transformFile "#{__dirname}/src/root.jsx", {presets: ['react', 'es2015']}, (err, result) ->
          fs.writeFile 'build/root.js', result.code, pCb
    , cb

gulp.task 'examples', (cb) ->
  examples = Object.keys(wpConfig.examples)
  async.each examples, (example, eCb) ->
    webpackConfig = wpConfig(example)
    webpack webpackConfig, (err, stats) ->
      throw new gutil.PluginError("Webpack", err) if err
      errors = stats.toJson().errors
      throw errors if errors.length > 0
      gutil.log "Webpack", stats.toString({colors: true})
      eCb()
  , cb
