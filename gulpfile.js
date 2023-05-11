let project_folder = 'build';
let source_folder = 'src';

let path = {
    build: {
        html: project_folder + '/',
        css: project_folder + '/css/',
        js: project_folder + '/js/',
        img: project_folder + '/img/',
        fonts: project_folder + '/fonts/',
        errors: project_folder + '/errors/'
    },
    src: {
        html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
        css: source_folder + '/scss/style.scss',
        js: source_folder + '/js/scripts.js',
        img: source_folder + '/img/**/*.+(png|jpg|jpeg|ico|svg|webp|rar)',
        fonts: source_folder + '/fonts/*',
        errors: source_folder + '/errors/404.php'
    },
    watch: {
        html: source_folder + '/**/*.html',
        css: source_folder + ['/scss/**/*.scss'],
        js: source_folder + '/js/**/*.js',
        img: source_folder + '/img/**/*.+(png|jpg|jpeg|ico|svg|webp|rar)',
        errors: source_folder + '/errors/**/*.php',
    },
    clean: './' + project_folder + '/'
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin')


    // BrowserSync
function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: './' + project_folder + '/'
        },
        port: 3000,
        notify: false
    })
}

    // HTML
function html() {
    return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.reload({stream: true}))
}

    // ERRORS
function errors() {
    return src(path.src.errors)
    .pipe(fileinclude())
    .pipe(dest(path.build.errors))
    .pipe(browsersync.stream())
}

    // Images
function images() {
    return src(path.src.img)
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

    // Images Compress
function img() {
    return src(path.src.img)
    .pipe(imagemin(
        [
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]
    ))
    .pipe(dest(path.build.img))
}

    // JavaScript
function js() {
    return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
        rename({
            extname: '.min.js'
        })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}


    // CSS
function css() {
    return src(path.src.css)
    .pipe(
        scss({
            outputStyle: "expanded"
        })
    )
    .pipe(
        group_media()
    )
    .pipe(
        autoprefixer({
            cascade: true,
            overrideBrowsersList: ['last 5 versions']
        })
    )
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
        rename({
            extname: '.min.css'
        })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

    // WatchFiles
function watchFiles(params) {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], img)
}

    // Clean
function clean(params) {
    return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(html, js, css, images, errors));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.img = img;
exports.images = images;
exports.js = js;
exports.html = html;
exports.css = css;
exports.errors = errors;
exports.build = build;
exports.watch = watch;
exports.default = watch;