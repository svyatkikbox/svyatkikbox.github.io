var syntax        = 'scss',
	gulpversion   = '4'; // Gulp version: 3 or 4

var gulp          = require('gulp'),
	gutil         = require('gulp-util' ),
	sass          = require('gulp-sass'),
	browserSync   = require('browser-sync'),
	concat        = require('gulp-concat'),
	uglify        = require('gulp-uglify'),
	cleancss      = require('gulp-clean-css'),
	rename        = require('gulp-rename'),
	autoprefixer  = require('gulp-autoprefixer'),
	notify        = require('gulp-notify'),
	rsync         = require('gulp-rsync'),
	image         = require('gulp-image');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
	})
});

gulp.task('styles', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
	.pipe(gulp.dest('app/public/css'))
	.pipe(browserSync.stream())
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/bootstrap/js/bootstrap.min.js',
		'app/js/common.js',
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify())
	.pipe(gulp.dest('app/public/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'],
		exclude: ['**/Thumbs.db', '**/*.DS_Store'],
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('img', function () {
    return gulp.src('app/img/**/*')
	.pipe(image({
		jpegRecompress: ['--strip', '--quality', 'medium', '--min', 50, '--max', 80],
		jpegoptim: false,
		mozjpeg: true,
		concurrent: 10,
	  }))
    .pipe(gulp.dest('app/public/img'));
});

if (gulpversion == 3) {
	gulp.task('watch', ['browser-sync'], function() {
		gulp.watch('app/'+syntax+'/**/*.'+syntax+'', ['styles']);
		gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
		gulp.watch('app/*.html', ['code'])
	});
	gulp.task('default', ['watch']);
}

if (gulpversion == 4) {
	gulp.task('watch', function() {
		gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
		gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
		gulp.watch('app/img/**/*.*', gulp.parallel('img'));
		gulp.watch('app/*.html', gulp.parallel('code'))
	});
	gulp.task('default', gulp.parallel('watch', 'browser-sync'));
}
