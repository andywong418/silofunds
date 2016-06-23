var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')({ lazy: 'true' });
var del = require('del');

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('vet', function() {
  log('Analyzing source with JSHint and JSCS');

  return gulp
      .src(config.alljs)
      .pipe($.if(args.verbose, $.print()))
      // .pipe($.jscs())
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
      .pipe($.jshint.reporter('fail'));
});

gulp.task('scss-watcher', function() {
  gulp.watch([config.scss], ['styles']);
});

gulp.task('clean-styles', function(done) {
  var files = config.scssDist + '**/*.css';
  clean(files, done);
});

gulp.task('styles', ['clean-styles'], function() {
  log('Compiling Compass --> CSS');

  return gulp
      .src(config.scss)
      .pipe($.plumber())
      .pipe($.if(args.verbose, $.print()))
      .pipe($.sass())
      .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%']}))
      .pipe(gulp.dest(config.scssDist));
});

gulp.task('images', ['clean-images'], function() {
  log('Copying and compressing images');

  return gulp
      .src(config.images)
      .pipe($.cache($.imagemin({ optimization: 4 })))
      .pipe(gulp.dest(config.dist + 'images'));
});

gulp.task('clean-images', function(done) {
  clean(config.dist + 'images/**/*.*', done);
});

gulp.task('cache:clear', function() {
  return $.cache.clearAll();
});

///////////////////////

function log(msg) {
  if (typeof(msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
}

function clean(path, done) {
  log('Cleaning: ' + $.util.colors.blue(path));
  del(path, done());
}
