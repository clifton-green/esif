var gulp    = require('gulp'),
fs          = require('fs'),
browserSync = require('browser-sync'),
concat      = require('gulp-concat'),
imagemin    = require('gulp-imagemin'),
pngquant    = require('imagemin-pngquant'),
plumber     = require('gulp-plumber'),
notifier    = require('node-notifier'),
cssnano     = require('gulp-cssnano'),
eslint      = require('gulp-eslint'),
del         = require('del'),
stylus      = require('gulp-stylus'),
jeet        = require('jeet'),
rupture     = require('rupture'),
csso        = require('gulp-csso'),
extReplace  = require('gulp-ext-replace'),
runSequence = require('run-sequence'),
uglify      = require('gulp-uglify'),
cmq         = require('gulp-merge-media-queries'),
nunjucks    = require('gulp-nunjucks-html'),
path        = require('path'),
data        = require('gulp-data'),
reload      = browserSync.reload;

// watch files for changes and reload
gulp.task('serve', function() {
  'use strict';
  browserSync.init({
      server: {
          baseDir: './dist'
      },
      // Change the default port
      port: 3000,
      // All open instances of the site will reload if the server is restarted
      reloadOnRestart: true,
      // // Don't show any notifications in the browser.
      notify: false,
      // // Sync actions between devices
      ghostMode: {
        clicks: true,
        forms: true,
        scroll: false
      }
  });
  // Perform the site init
  runSequence('build:dev');

  // Compile Standard JS
  gulp.watch('src/scripts/*.js', ['scripts:dev'], reload);

  // Compile Stylus
  gulp.watch('src/styles/**/*.styl', ['styles']);

  // Compile Standard JS
  gulp.watch('src/images', ['images'], reload);

  // Compile HTML and JSON
  gulp.watch(['src/html/**/*.nunjucks', 'src/model/**/*.json'], ['processHTML'], reload);

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

// Process and move supplementary CSS
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
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/lodash/lodash.js'
    ])
    .pipe(plumber(
      { errorHandler: onError }
    ))
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/static/libs'))
});

// Combine JS
gulp.task('scripts:prod', function() {
  'use strict';
  return gulp.src(['src/scripts/**/*.js', '!src/scripts/**/dev.js'])
    .pipe(plumber(
      { errorHandler: onError }
    ))
    .pipe(eslint())
    .pipe(concat('core.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/static/scripts'))
    .pipe(reload({stream:true}))
});

// Add Dev Javascript into the build
gulp.task('scripts:dev', function() {
  'use strict';
  return gulp.src('src/scripts/**/*.js')
    .pipe(plumber(
      { errorHandler: onError }
    ))
    .pipe(eslint())
    .pipe(concat('core.min.js'))
    .pipe(gulp.dest('dist/static/scripts'))
    .pipe(reload({stream:true}))
});


// Process nunjucks html files (.nunjucks)
gulp.task('processHTML', function() {
  'use strict';
  return gulp.src('src/html/pages/**/*.nunjucks')
    .pipe(plumber(
      { errorHandler: onError }
    ))
    .pipe(data(function(file) {
      return JSON.parse(fs.readFileSync('./src/model/' + path.basename(file.path, '.nunjucks') + '.json'));
    }))
    .pipe(data(function() {
      return JSON.parse(fs.readFileSync('./src/model/globals.json'));
    }))
    .pipe(nunjucks({
      searchPaths: ['src/html/templates']
    }))
    .pipe(extReplace('.html'))
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream:true}))
});

// Perform Basic Build (note, don't call directly, use build:dev or build)
gulp.task('build', function (callback) {
  'use strict';
  runSequence(
    'styles',
    'extrastyles',
    'libs',
    'processHTML',
    callback
  );
});

// Standard build - not deployment ready and doesn't perform a clean build
gulp.task('build:dev', function() {
  'use strict';
  runSequence(
    'build',
    'scripts:dev'
  );
  notifier.notify({ title: 'Development Build', message: 'Completed', icon: 'src/images/icons/apple-touch-icon.png' });
})

// Production Build - ready for deployment and cleans build first
gulp.task('build:prod', ['clean'], function() {
  'use strict';
  runSequence(
    'build',
    'scripts:prod',
    'images'
  );
  notifier.notify({ title: 'Production Build', message: 'Done', icon: 'src/images/icons/apple-touch-icon.png' });
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
    return del(['dist/**/*.*'], cb)
});
