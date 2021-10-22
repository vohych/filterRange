let prod = './prod/';
let dev = './dev/';

let gulp = require('gulp');
let sass = require('gulp-sass')(require('sass'));
let babel = require('gulp-babel');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let rename = require('gulp-rename');
let cleanCSS = require('gulp-clean-css');
let del = require('del');
let autoprefixer = require('gulp-autoprefixer');
let browserSync = require('browser-sync').create();

const paths = {
    html: {
      src: dev + 'index.html',
      dest: prod
    },
    styles: {
      src:  dev + 'styles/index.sass',
      dest: prod + 'styles/'
    },
    scripts: {
      src: dev + 'scripts/*.js',
      dest: prod + 'scripts/'
    }
};

function clean() {
  return del([ 'prod' ]);
}

function html() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

function watchFiles() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.html.src, html);

}

function browserHost() {
    console.log("browserHost started")
    gulp.task('browserSync', function() {
        browserSync.init({
            server: {
                baseDir: "./prod"
            },
            tunnel: true,
            host: 'localhost',
            port: 80,
        })
    })
}

 
let build = gulp.series(browserHost, clean, html, gulp.parallel(styles, scripts));
let watch = gulp.parallel(browserHost, build, watchFiles);

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;

exports.watch = watch;
exports.build = build;
exports.default = watch;
