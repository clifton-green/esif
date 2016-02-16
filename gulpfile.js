var gulp    = require('gulp'),
browserSync = require('browser-sync'),
concat      = require('gulp-concat'),
imagemin    = require('gulp-imagemin'),
pngquant    = require('imagemin-pngquant'),
plumber     = require('gulp-plumber'),
notifier    = require('node-notifier'),
cssnano     = require('gulp-cssnano'),
eslint      = require('gulp-eslint'),
del         = require('del'),
replace     = require('gulp-replace'),
stylus      = require('gulp-stylus'),
jeet        = require('jeet'),
rupture     = require('rupture'),
csso        = require('gulp-csso'),
extReplace  = require('gulp-ext-replace'),
runSequence = require('run-sequence'),
cmq         = require('gulp-merge-media-queries'),
nunjucks    = require('gulp-nunjucks-html'),
path        = require('path'),
data        = require('gulp-data'),
Server      = require('karma').Server,
reload      = browserSync.reload;

// watch files for changes and reload
gulp.task('serve', function() {
  'use strict';
  browserSync({
      proxy: 'esif.localhost'
  });
  // Perform the site init
  runSequence('build:dev');

  // Compile Stylus
  gulp.watch('src/styles/**/*.styl', ['styles']);

  // Compile Standard JS
  gulp.watch('src/scripts/*.js', ['scripts']);

  // Compile Standard JS
  gulp.watch('src/images', ['images']);

  // Compile HTML
  gulp.watch('src/html/**/*.nunjucks', ['processHTML']);
});

var errors = 0,
    supportedBrowsers = [
    'last 2 versions',
    'safari >= 8',
    'ie >= 10',
    'ff >= 20',
    'ios 6',
    'android 4'
],
onError = function (err) {
  'use strict';
  notifier.notify({ title: 'Development Build', message: 'Failed', icon: 'http://cdn.volcaniccreations.com/topaz/failed.png' });
  console.log(err);
  errors = errors+1
  this.emit('end');
};

// Combine styles
gulp.task('styles', function(callback) {
  'use strict';
  return gulp.src('src/styles/core.styl')
    .pipe(plumber(
      { errorHandler: onError }
    ))
    .pipe(stylus({use: [jeet(), rupture()]}))
    .pipe(concat('core.min.css'))
    .pipe(cmq())
    .pipe(csso())
    .pipe(cssnano({
      autoprefixer: {browsers: supportedBrowsers, add: true}
    }))
    .pipe(gulp.dest('dist/static/css'))
    .pipe(reload({stream:true}))
     callback();
});

// Process and move supplimentary CSS
gulp.task('extrastyles', function(callback) {
  'use strict';
  gulp.src('src/styles/print.styl')
    .pipe(plumber(
      { errorHandler: onError }
    ))
    .pipe(stylus())
    .pipe(concat('print.min.css'))
    .pipe(gulp.dest('dist/static/css'))
  gulp.src('src/styles/fonts.css')
    .pipe(gulp.dest('dist/static/css'))
     callback();
});

// Move libraries
gulp.task('libs', function() {
  'use strict';
  return gulp.src('node_modules/jquery/dist/jquery.min.js')
    .pipe(plumber(
      { errorHandler: onError }
    ))
    .pipe(gulp.dest('dist/static/libs'))
});

// Combine JS
gulp.task('scripts', function() {
  'use strict';
  return gulp.src('src/scripts/*.js')
    .pipe(plumber(
      { errorHandler: onError }
    ))
    .pipe(eslint())
    .pipe(concat('core.min.js'))
    .pipe(gulp.dest('dist/static/scripts'))
    .pipe(reload({stream:true}))
});

// Process nunjucks html files (.nj.html)
gulp.task('nunjucks', function() {
  'use strict';
  return gulp.src('src/html/pages/**/*.nunjucks')
    .pipe(plumber(
      { errorHandler: onError }
    ))
    .pipe(data(function(file) {
      return require('./src/model/' + path.basename(file.path) + '.json');
    }))
    .pipe(nunjucks({
      searchPaths: ['src/html/templates']
    }))
    .pipe(extReplace('.html'))
    .pipe(gulp.dest('dist'))
});

// Replaces variables in the master page (layout.nunjucks) and adds a build timestamp
gulp.task('processHTML', ['nunjucks'], function () {
  'use strict';
  return gulp.src(['dist/**/*.html'])
   .pipe(replace('$$site_name$$', 'esif'))
   .pipe(replace('$$site_url$$', 'localhost:3000'))
   .pipe(replace('$$site_desc$$', 'To be added'))
   .pipe(gulp.dest('dist'))
   .pipe(reload({stream:true}))
});

// Perform Basic Build (note, don't call directly, use build:dev or build)
gulp.task('build', function (callback) {
  'use strict';
  runSequence(
    'processHTML',
    'styles',
    'extrastyles',
    'libs',
    'scripts',
    callback
  );
});

// Standard build - not deployment ready and doesn't perform a clean build
gulp.task('build:dev', function() {
  'use strict';
  runSequence('build');
  notifier.notify({ title: 'Development Build', message: 'Completed', icon: 'http://cdn.volcaniccreations.com/topaz/passed.png' });
})

// Production Build - ready for deployment and cleans build first
gulp.task('build:prod', function() {
  'use strict';
  runSequence('clean', ['build', 'images']);
  notifier.notify({ title: 'Production Build', message: 'Done', icon: 'http://cdn.volcaniccreations.com/topaz/passed.png' });
})

// Compress and minify images to reduce their file size
gulp.task('images', function() {
  'use strict';
  var imgSrc = 'src/images/**/*',
      imgDst = 'dist/static/images';

  return gulp.src(imgSrc)
    .pipe(plumber())
    .pipe(imagemin({
         progressive: true,
         svgoPlugins: [{removeViewBox: false}],
         use: [pngquant()]
    }))
    .pipe(gulp.dest(imgDst))
});
// Deletes contents of dist folder
gulp.task('clean', function(cb) {
    'use strict';
    del(['dist/**/*.*'], cb)
});

// Run a single batch of tests
gulp.task('test', function (done) {
  'use strict';
  return new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

// Run tests continiously
gulp.task('tdd', function (done) {
  'use strict';
  return new Server({
    configFile: __dirname + '/karma.conf.js',
  }, done).start();
});
