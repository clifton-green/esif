var gulp    = require('gulp'),
browserSync = require('browser-sync'),
concat      = require('gulp-concat'),
imagemin    = require('gulp-imagemin'),
pngquant    = require('imagemin-pngquant'),
plumber     = require('gulp-plumber'),
notify      = require('gulp-notify'),
cssnano     = require('gulp-cssnano'),
eslint      = require('gulp-eslint'),
del         = require('del'),
replace     = require('gulp-replace'),
stylus      = require('gulp-stylus'),
jeet        = require('jeet'),
rupture     = require('rupture'),
csso        = require('gulp-csso'),
extReplace  = require('gulp-ext-replace'),
cmq         = require('gulp-combine-media-queries'),
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
  gulp.start('clean', 'processHTML', 'images', 'styles', 'libs', 'scripts', 'extrastyles');

  // Compile Stylus
  gulp.watch('src/styles/**/*.styl', ['styles']);

  // Compile Standard JS
  gulp.watch('src/scripts/*.js', ['scripts']);

  // Compile Standard JS
  gulp.watch('src/images', ['images']);

  // Compile HTML
  gulp.watch('src/html/**/*.nunjucks', ['processHTML']);
});

var supportedBrowsers = [
    'last 2 versions',
    'safari >= 8',
    'ie >= 10',
    'ff >= 20',
    'ios 6',
    'android 4'
]

// Combine styles
gulp.task('styles', function() {
  'use strict';
  gulp.src('src/styles/core.styl')
    .pipe(plumber())
    .pipe(stylus({use: [jeet(), rupture()]}))
    .pipe(concat('core.min.css'))
    .pipe(cmq({
        log: true
    }))
    .pipe(csso())
    .pipe(cssnano({
      autoprefixer: {browsers: supportedBrowsers, add: true}
    }))
    .pipe(gulp.dest('dist/static/css'))
    .pipe(reload({stream:true}))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Process and move supplimentary CSS
gulp.task('extrastyles', function() {
  'use strict';
  gulp.src('src/styles/print.styl')
    .pipe(stylus({use: [jeet()]}))
    .pipe(plumber())
    .pipe(concat('print.min.css'))
    .pipe(gulp.dest('dist/static/css'))
  gulp.src('src/styles/fonts.css')
    .pipe(gulp.dest('dist/static/css'))
});

// Move libraries
gulp.task('libs', function() {
  'use strict';
  return gulp.src('node_modules/jquery/dist/jquery.min.js')
    .pipe(plumber())
    .pipe(gulp.dest('dist/static/libs'))
    .pipe(notify({ message: 'Libraries task complete' }));
});

// Combine JS
gulp.task('scripts', function() {
  'use strict';
  return gulp.src('src/scripts/*.js')
    .pipe(plumber())
    .pipe(eslint())
    .pipe(concat('core.min.js'))
    .pipe(gulp.dest('dist/static/scripts'))
    .pipe(reload({stream:true}))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Process nunjucks html files (.nj.html)
gulp.task('nunjucks', function() {
  'use strict';
  return gulp.src('src/html/pages/**/*.nunjucks')
    .pipe(plumber())
    .pipe(data(function(file) {
      return require('./src/model/' + path.basename(file.path) + '.json');
    }))
    .pipe(nunjucks({
      searchPaths: ['src/html/templates']
    }))
    .pipe(extReplace('.html'))
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'Nunjucks task complete' }));
});

// Replaces variables in the master page (layout.nunjucks) and adds a build timestamp
gulp.task('processHTML', ['nunjucks'], function () {
  'use strict';
  gulp.src(['dist/**/*.html'])
   .pipe(replace('$$site_name$$', 'esif'))
   .pipe(replace('$$site_url$$', 'localhost:3000'))
   .pipe(replace('$$site_desc$$', 'To be added'))
   .pipe(gulp.dest('dist'))
   .pipe(reload({stream:true}))
   .pipe(notify({ message: 'HTML processing complete' }));
});

// Some extra things should happen before the site is deployed.
// this task performs those subtasks.
gulp.task('build', function () {
  'use strict';
  gulp.start(
    'clean',
    'processHTML',
    'styles',
    'extrastyles',
    'libs',
    'scripts',
    'images'
  );
});

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
    .pipe(notify({ message: 'Images task complete' }));
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
