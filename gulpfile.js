var gulp = require("gulp"),
    jade = require('gulp-jade'),
    prettify = require('gulp-prettify'),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    gulpif = require('gulp-if'),
    filter = require('gulp-filter'),
    size = require('gulp-size'),
    imagemin = require('gulp-imagemin'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    browserSync = require('browser-sync'),
    gutil = require('gulp-util'),
    ftp = require('vinyl-ftp'),
    reload = browserSync.reload,
    autoprefixer = require('gulp-autoprefixer'),
    uncss = require('gulp-uncss'),
    sass = require('gulp-sass'),
    gcallback = require('gulp-callback'),
    changed = require('gulp-changed');

gulp.task('jade', function () {
	gulp.src('app/templates/pages/*.jade')
	.pipe(jade({
		pretty: true
	}))
	.on('error', log)
	.pipe(gulp.dest('app/'))
	.pipe(reload({stream: true}));
});

gulp.task('clean-css', function() {
	return gulp.src('app/css/**.*')
		.pipe(clean());
});
gulp.task('scss', ['clean-css'], function() {
	gulp.src('app/scss/*.scss')
		.pipe(sass({
			noCache: true,
			style: "expanded",
			lineNumbers: true,
			errLogToConsole: true
		}))
		.on('error', log)
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie 8', 'ie 9'],
			cascade: false
		}))
		.pipe(gulp.dest('app/css/all'))
		.pipe(gcallback(function() {
			gulp.src('app/css/all/*.css')
			    .pipe(concatCss("main.css"))
			    .pipe(gulp.dest('app/css'));
		}));
});

gulp.task('scss_oldIe', function() {
	gulp.src('app/scss/oldIe/*.scss')
		.pipe(sass({
			noCache: true,
			style: "expanded",
			lineNumbers: true,
			errLogToConsole: true
		}))
		.on('error', log)
		.pipe(gulp.dest('app/css'));
});

gulp.task('server', ['jade', 'scss', 'scss_oldIe'], function () {
	browserSync({
		// open: false,
		notify: false,
		port: 9000,
		server: {
			baseDir: 'app'
		}
	});
});

// gulp.task('concatCss', function () {
//   return gulp.src('app/css/all/*.css')
//     .pipe(concatCss("main.css"))
//     .pipe(gulp.dest('app/css'));
// });

gulp.task('wiredep', function() {
	gulp.src('app/templates/common/*.jade')
		.pipe(wiredep({
			ignorePath: /^(\.\.\/)*\.\./
		}))
		.pipe(gulp.dest('app/templates/common/'))
});


gulp.task('watch', function () {
	gulp.watch('app/templates/**/*.jade', ['jade']);
	gulp.watch('app/scss/*.scss', ['scss']);
	gulp.watch('app/scss/oldIe/*.scss', ['scss_oldIe']);
	gulp.watch('bower.json', ['wiredep']);
	gulp.watch([
		'app/js/**/*.js',
		'app/css/main.css',
		'app/*.html'
	]).on('change', reload);
});

gulp.task('default', ['server', 'watch']);


var log = function (error) {
  console.log([
    '',
    "----------ERROR MESSAGE START----------",
    ("[" + error.name + " in " + error.plugin + "]"),
    error.message,
    "----------ERROR MESSAGE END----------",
    ''
  ].join('\n'));
  this.end();
}


gulp.task('clean', function() {
	return gulp.src('dist')
		.pipe(clean());
});

gulp.task('useref', function () {
	var assets = useref.assets();
	return gulp.src('app/*.html')
		.pipe(assets)
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss({compatibility: 'ie8'})))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('dist'));
});

gulp.task('fonts', function() {
	gulp.src('app/fonts/*')
		.pipe(filter(['*.eot','*.svg','*.ttf','*.woff','*.woff2']))
		.pipe(gulp.dest('dist/fonts/'))
});

gulp.task('images', function () {
	return gulp.src('app/img/**/*')
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('extras', function () {
	return gulp.src([
		'app/*.*',
		'app/.htaccess',
		'!app/*.html'
	]).pipe(gulp.dest('dist'));
});

gulp.task('dist', ['useref', 'images', 'fonts', 'extras'], function () {
	return gulp.src('dist/**/*').pipe(size({title: 'build'}));
});


gulp.task('uncss', function () {
    return gulp.src('dist/css/*.css')
        .pipe(uncss({
            html: ['dist/*.html']
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('build', ['clean', 'jade'], function () {
	gulp.start('dist')
		.start('uncss');
});

gulp.task('server-dist', function() {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: 'dist'
		}
	});
});

gulp.task('deploy', function() {
	var conn = ftp.create({
		host: '',
		user: '',
		password: '',
		parallel: 10,
		log: gutil.log
	});

	var globs = [
		'dist/**/*'
	];

	return gulp.src(globs, { base: 'dist/', buffer: false})
		.pipe(conn.dest('krylev.ru/public_html/dist_dz/'));
});
