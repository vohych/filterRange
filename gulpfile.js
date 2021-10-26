console.clear();
const prod = './prod/';
const dev = './dev/';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

function browserHost() {
    browserSync.init({
        server: {
            baseDir: prod,
            open: true,
            notify: false,
            ui: false
        },
        tunnel: true,
        host: 'localhost',
        port: 8081,
    })
}

const paths = {
    html: {
        src: dev + 'index.html',
        dest: prod
    },
    styles: {
        src: dev + 'styles/index.sass',
        dest: prod + 'styles/'
    },
    scripts: {
        src: dev + 'scripts/*.js',
        dest: prod + 'scripts/'
    }
};

function clean() {
    return del(['prod']);
}

function html() {
    console.log('this')
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.reload({stream: true}))

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
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest(paths.styles.dest))
}

function scripts() {
    return gulp.src(paths.scripts.src, {sourcemaps: true})
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest(paths.scripts.dest))
}

function watchFiles() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.html.src, html);
}

const build = gulp.series(clean, html, gulp.parallel(styles, scripts));
const watch = gulp.parallel(build, watchFiles, browserHost);

const exportsFixes = exports;
exportsFixes.clean = clean;
exportsFixes.styles = styles;
exportsFixes.scripts = scripts;
exportsFixes.html = html;

exportsFixes.watch = watch;
exportsFixes.build = build;
exportsFixes.default = watch;


//Иногда при использовании CLI скрипт не вставлен в основные файлы HTML,
// поэтому вам следует добавить его вручную или использовать gulp.
<!-- START: BrowserSync Reloading -->
// <script type='text/javascript' id="__bs_script__">
//<![CDATA[
// document.write("<script async src='/browser-sync/browser-sync-client.js'><\/script>".replace("HOST", location.hostname));
//]]>
// </script>
<!-- END: BrowserSync Reloading -->