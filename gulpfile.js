const gulp = require('gulp');
const del = require('del');
const Builder = require('systemjs-builder');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const browserSync = require('browser-sync');
const historyApiFallback = require('connect-history-api-fallback');
const concat = require('gulp-concat');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
// const minify = require('gulp-minify');
const reload = browserSync.reload;

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});

//minify the css
gulp.task('minify-css',['less'], function() {
  return gulp.src('dist/app/global/stylesheets/*.css')
    .pipe(cleanCSS({debug: true, processImport:false}, function(details) {
            // console.log(details.name + ': ' + details.stats.originalSize);
            // console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
    .pipe(gulp.dest('dist/app/global/stylesheets'));
});

//minify javascript
// gulp.task('compress', ['copy:assets'], function() {
//   gulp.src('dist/app/**/*.js')
//     .pipe(minify({
//         ext:{
//             src:'-debug.js',
//             min:'.js'
//         },
//         exclude: ['lib'],
//     }))
//     .pipe(gulp.dest('dist/app'))
// });

/** then bundle */
gulp.task('bundle', ['clean', 'copy:libs'], function() {
    // optional constructor options
    // sets the baseURL and loads the configuration file
    var builder = new Builder('', 'dist/lib/system.config.js');
    /*
       the parameters of the below buildStatic() method are:
           - your transcompiled application boot file (the one wich would contain the bootstrap(MyApp, [PROVIDERS]) function - in my case 'dist/app/boot.js'
           - the output (file into which it would output the bundled code)
           - options {}
    */
    return builder
        .buildStatic('dist/app/main.js', 'dist/lib/bundle.js', { minify: true, sourceMaps: true})
        .then(function() {
            console.log('Build complete');
        })
        .catch(function(err) {
            console.log('Build error');
            console.log(err);
        });
});

// TypeScript compile
gulp.task('compile', ['clean'], function () {
  return gulp
    .src(['app/**/*.ts', '!app/**/*spec.ts'])
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(gulp.dest('dist/app'));
});

// copy dependencies
gulp.task('copy:libs', ['clean'], function() {
  return gulp.src([
      'node_modules/core-js/client/core.min.js',
      'node_modules/core-js/client/core.min.js.map',
      // 'node_modules/es6-shim/es6-shim.min.js',
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/systemjs/dist/system-polyfills.js.map',
      'node_modules/reflect-metadata/Reflect.js',
      'node_modules/reflect-metadata/Reflect.js.map',
      'node_modules/symbol-observable/*.js',
      'node_modules/symbol-observable/*.map',
      'node_modules/@angular/**/*.js',
      'node_modules/@angular/**/*.map',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/rxjs/**/*.js',
      'node_modules/rxjs/**/*.map',
      'node_modules/node-uuid/uuid.js',
      'node_modules/immutable/dist/immutable.js',
      'node_modules/highcharts/highcharts.js',
      'node_modules/moment/moment.js',
      // 'node_modules/moment-timezone/moment-timezone.js',//load only one moment timezone otherwise problems will occur
      'node_modules/moment-timezone/builds/moment-timezone-with-data-2010-2020.js',
      'node_modules/fuse.js/src/fuse.min.js',
      'node_modules/zone.js/dist/zone.js',

    ])
    .pipe(gulp.dest('dist/lib'));
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function() {
  return gulp.src(['app/**/*', 'index.html', 'master.css', '!app/**/*.ts', '!app/**/*.less'], { base : './' })
    .pipe(gulp.dest('dist'));
});

gulp.task('less', ['clean'], function() {
    return gulp.src(['./app/**/*.less'])
        .pipe(concat('master.css'))
        .pipe(less())
        .pipe(gulp.dest('dist/app/global/stylesheets'));
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

// gulp.task('build', ['compile', 'less', 'copy:libs', 'copy:assets', 'minify-css', 'compress']);
gulp.task('build', ['compile', 'less', 'copy:libs', 'copy:assets', 'minify-css','bundle']);
gulp.task('buildAndReload', ['build'], reload);
gulp.task('default', ['build']);

//GULP TASKS for TESTING
gulp.task('compile-tests', ['clean'], function () {
  return gulp
    .src(['app/main.ts', 'app/**/*.spec.ts'])
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-tests', ['compile-tests', 'build']);
gulp.task('test', ['build-tests']);
