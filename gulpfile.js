var gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    gutil       = require('gulp-util'),
    chalk       = require('chalk'),
    argv        = require('yargs').argv,
    fs          = require('fs'),
    browserSync = require('browser-sync'),
    addsrc      = require('gulp-add-src'),
    concat      = require('gulp-concat'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    plumber     = require('gulp-plumber'),
    notifier    = require('node-notifier'),
    cssnano     = require('gulp-cssnano'),
    jsonlint    = require('gulp-jsonlint'),
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
    webpack     = require('webpack-stream'),
    WebpackDevServer = require('webpack-dev-server'),
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
  runSequence('build');

  // Compile Standard JS
  gulp.watch('src/scripts/*.js', ['scripts'], reload);

  // Compile Stylus
  gulp.watch('src/styles/**/*.styl', ['styles']);

  // Compile Standard JS
  gulp.watch('src/images', ['images'], reload);

  // Compile HTML and JSON
  gulp.watch(['src/html/**/*.nunjucks', 'src/model/**/*.json'], ['processHTML'], reload);

  // Show success message
  console.log(chalk.green('✔ Server started!'))
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
  console.log(chalk.red('✘ Build failed!'))
  notifier.notify({ title: 'Build', message: 'Failed', icon: 'http://cdn.volcaniccreations.com/topaz/failed.png' });
  console.log(err);
  errors = errors+1
  this.emit('end');
};

// Combine styles
gulp.task('styles', function(callback) {
  'use strict';
  return gulp.src('src/styles/start.styl')
    .pipe(gulpif(!argv.prod, addsrc('src/styles/dev.styl')))
    .pipe(plumber(
      { errorHandler: onError }
    ))
    .pipe(stylus({
      'include css': true,
      use: [jeet(), rupture()]
    }))
    .pipe(concat('core.min.css'))
    .pipe(cmq())
    .pipe(csso())
    .pipe(
      cssnano({
        autoprefixer: {browsers: supportedBrowsers, add: true}
      })
    )
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
  callback();
});

// Move libraries
gulp.task('libs', function() {
  'use strict';
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js'
    ])
    .pipe(plumber(
      { errorHandler: onError }
    ))
    .pipe(concat('libs.min.js'))
    .pipe(gulpif(argv.prod, uglify()))
    .pipe(gulp.dest('dist/static/libs'))
});

// Move jsoneditor
gulp.task('jsoneditor', function() {
  'use strict';
  return gulp.src([
    'node_modules/jsoneditor/**/*',
    ])
    .pipe(plumber(
      { errorHandler: onError }
    ))
    .pipe(gulp.dest('dist/jsoneditor'))
});

// Move json
gulp.task('model', function() {
  'use strict';
  return gulp.src([
    'src/model/**/*',
    ])
    .pipe(plumber(
      { errorHandler: onError }
    ))
    .pipe(gulp.dest('dist/model'))
});

// Combine JS
gulp.task('scripts', function() {
  'use strict';
  return gulp.src(argv.prod ? ['src/scripts/loader.js'] : 'src/scripts/devloader.js')
    .pipe(plumber(
      { errorHandler: onError }
    ))
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(eslint())
    .pipe(concat('core.min.js'))
    .pipe(gulpif(argv.prod, uglify()))
    .pipe(gulp.dest('dist/static/scripts'))
    .pipe(reload({stream:true}))
});

// Start a webpack-dev-server
gulp.task('webpack-dev-server', function(callback) {
    'use strict';
    var compiler = webpack({
        // configuration
    });

    new WebpackDevServer(compiler, {
        // server and middleware options
    }).listen(8080, 'localhost', function(err) {
        if(err) { throw new gutil.PluginError('webpack-dev-server', err); }
        // Server listening
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');

        // keep the server alive or continue?
        // callback();
    });
});

//Make sure the json data is correctly formed
gulp.task('testModel', function() {
  'use strict';
  return gulp.src('./src/model/**/*.json')
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
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

var prodBuild = ['clean', 'styles','extrastyles','libs','scripts','images','processHTML', 'notify'],
    devBuild = ['styles','extrastyles','libs','testModel','processHTML','jsoneditor','model','scripts', 'notify'],
    buildTasks = argv.prod ? prodBuild : devBuild;

// Perform Basic Build (note, don't call directly, use build:dev or build)
gulp.task('build', function (callback) {
  'use strict';
  runSequence.apply(
    null,
    buildTasks,
    callback
  );
});

gulp.task('notify', function() {
  'use strict'
  console.log(chalk.green('✔ Build complete!'))
  notifier.notify({ title: 'Build', message: 'Completed', icon: 'src/images/icons/apple-touch-icon.png' });
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
