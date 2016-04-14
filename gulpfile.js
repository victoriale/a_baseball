const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const browserSync = require('browser-sync');
const historyApiFallback = require('connect-history-api-fallback');
const concat = require('gulp-concat');
const less = require('gulp-less');
const reload = browserSync.reload;

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});

// TypeScript compile
gulp.task('compile', ['clean'], function () {
  return gulp
    .src('app/**/*.ts')
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(gulp.dest('dist/app'));
});

// copy dependencies
gulp.task('copy:libs', ['clean'], function() {
  return gulp.src([
      'node_modules/es6-shim/es6-shim.min.js',
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/angular2/bundles/angular2-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/rxjs/bundles/Rx.js',
      'node_modules/angular2/bundles/angular2.dev.js',
      'node_modules/angular2/bundles/router.dev.js',
      'node_modules/angular2/bundles/http.js',
      'node_modules/node-uuid/uuid.js',
      'node_modules/immutable/dist/immutable.js',
      'node_modules/angular2/es6/dev/src/testing/shims_for_IE.js',
      'node_modules/highcharts/highcharts.js',
      'node_modules/moment/moment.js',
    ])
    .pipe(gulp.dest('dist/lib'))
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function() {
  return gulp.src(['app/**/*', 'index.html', 'master.css', '!app/**/*.ts', '!app/**/*.less'], { base : './' })
    .pipe(gulp.dest('dist'))
});

gulp.task('less', ['clean'], function() {
    return gulp.src(['./app/**/*.less'])
        .pipe(concat('master.css'))
        .pipe(less())
        .pipe(gulp.dest('dist/app/global/stylesheets'))
});

// Run browsersync for development
gulp.task('serve', ['build'], function() {
  browserSync({
    server: {
      baseDir: 'dist',
        middleware: [ historyApiFallback() ]
    }
  });

  gulp.watch(['app/**/*', 'index.html', 'master.css'], ['buildAndReload']);
});

gulp.task('build', ['compile', 'less', 'copy:libs', 'copy:assets']);
gulp.task('buildAndReload', ['build'], reload);
gulp.task('default', ['build']);
