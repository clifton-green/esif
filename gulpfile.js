var gulp = require('gulp')
    ,browserSync = require('browser-sync')
    ,concat     = require('gulp-concat')
    ,imagemin   = require('gulp-imagemin')
    ,pngquant = require('imagemin-pngquant')
    ,plumber    = require('gulp-plumber')
    ,notify     = require('gulp-notify')
    ,cssnano = require('gulp-cssnano')
    ,eslint = require('gulp-eslint')
    ,del = require('del')
    ,stylus = require('gulp-stylus')
    ,jeet = require('jeet')
    ,rupture = require('rupture')
    ,cmq = require('gulp-combine-media-queries');


var reload     = browserSync.reload;

// watch files for changes and reload
gulp.task('serve', function() {
    'use strict';
    browserSync({
        proxy: 'esif.localhost'
    });
    // Perform the site init
    gulp.start('styles', 'scripts');

    // Compile Stylus
    gulp.watch('src/styles/**/*.styl', ['styles']);

    // Compile Standard JS
    gulp.watch('src/scripts/*.js', ['scripts']);

    gulp.watch('*.html', { cwd: 'src/html' }, reload);
});

// Combine styles
gulp.task('styles', function() {
    'use strict';
    gulp.src('src/styles/core.styl')
        .pipe(stylus({use: [jeet(), rupture()]}))
        .pipe(plumber())
        .pipe(concat('style.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/wp-content/themes/clarity'))
        .pipe(reload({stream:true}))
        .pipe(notify({ message: 'Styles task complete' }));
});

// Combine JS
gulp.task('scripts', function() {
    'use strict';
    return gulp.src('src/scripts/*.js')
        .pipe(plumber())
        .pipe(eslint())
        .pipe(concat('core.min.js'))
        .pipe(gulp.dest('dist/wp-content/themes/clarity/scripts'))
        .pipe(reload({stream:true}))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// combine media queries (Not done by default, should be called before deployment to production)
gulp.task('cmq', function () {
    'use strict';
    gulp.src('dist/wp-content/themes/clarity/*.css')
        .pipe(cmq({
            log: true
        }))
        .pipe(gulp.dest('dist/wp-content/themes/clarity'));
});

// Some extra things should happen before the site is deployed.
// this task performs those subtasks.
gulp.task('deploy', function () {
    'use strict';
    gulp.start('styles', 'scripts','images', 'cmq');
});

// Compress and minify images to reduce their file size
gulp.task('images', function() {
    'use strict';
    var  imgSrc = 'src/images/**/*'
        ,imgDst = 'dist/wp-content/themes/clarity/images';

    return gulp.src(imgSrc)
        .pipe(plumber())
        .pipe(imagemin({
             progressive: true
            ,svgoPlugins: [{removeViewBox: false}]
            ,use: [pngquant()]
        }))
        .pipe(gulp.dest(imgDst))
        .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function(cb) {
    'use strict';
    del(['dist/wp-content/themes/clarity/images', 'dist/wp-content/themes/clarity/scripts'], cb)
});
