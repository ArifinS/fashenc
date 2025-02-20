/**
 * Load custom Configuration.
 *
 */
const config = require('./project.config.js');

/**
  * Load Plugins.
  *
  */
const gulp = require('gulp');

// CSS related plugins.
const sass         = require('gulp-sass')(require('sass'));
const minifycss    = require('gulp-uglifycss');
const autoprefixer = require('gulp-autoprefixer');
const mmq          = require('gulp-merge-media-queries');
const beautify     = require('gulp-cssbeautify');

// Image related plugins.
const imagemin = require('gulp-imagemin');

// Utility related plugins.
const rename      = require('gulp-rename');
const lineec      = require('gulp-line-ending-corrector');
const filter      = require('gulp-filter');
const sourcemaps  = require('gulp-sourcemaps');
const notify      = require('gulp-notify');
const browserSync = require('browser-sync').create();
const cache       = require('gulp-cache');
const plumber     = require('gulp-plumber');
const newer       = require('gulp-newer');
const del         = require('del');
const beep        = require('beepbeep');

// Build related plugins
const chmod = require('gulp-chmod');
const zip   = require('gulp-zip');

/**
  * Custom Error Handler.
  *
  * @param Mixed err
  */
const errorHandler = (r) => {
	notify.onError('❌ ➨ ERROR: <%= error.message %>')(r);
	beep();
};

/**
  * Task: `browser-sync`.
  *
  * Live Reloads, CSS injections, Localhost tunneling.
  * @link http://www.browsersync.io/docs/options/
  *
  * @param {Mixed} done Done.
  */
const browsersync = (done) => {
	browserSync.init({
		// proxy: config.projectURL,
		server: "./",
		open: config.browserAutoOpen,
		injectChanges: config.injectChanges,
		watchEvents: [ 'change', 'add', 'unlink', 'addDir', 'unlinkDir' ]
	});
	done();
};

// Helper function to allow browser reload with Gulp 4.
const reload = (done) => {
	browserSync.reload();
	done();
};

/**
  * Task: `styles`.
  *
  * Compiles Sass, Autoprefixes it and Minifies CSS.
  *
  */
gulp.task('styles', () => {
	return gulp
		.src(config.styleSRC, { allowEmpty: true })
		.pipe(plumber(errorHandler))
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				errLogToConsole: config.errLogToConsole,
				outputStyle: config.outputStyle,
				precision: config.precision
			})
		)
		.on('error', sass.logError)
		.pipe(autoprefixer(config.BROWSERS_LIST))
		.pipe(lineec())
		.pipe(sourcemaps.write({ includeContent: true }))
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(config.styleDestination))
		.pipe(filter('**/*.css'))
		.pipe(browserSync.stream())
		.pipe(notify({ message: '✅ SASS Compilation ➨ Completed!', onLast: true }));
});

/**
  * Task: `buildStyles`.
  *
  * Compiles Sass, Autoprefixes it and Minifies CSS.
  *
  */
gulp.task('buildStyles', () => {
	return gulp
		.src(config.styleSRC, { allowEmpty: true })
		.pipe(plumber(errorHandler))
		.pipe(
			sass({
				errLogToConsole: config.errLogToConsole,
				outputStyle: config.outputStyle,
				precision: config.precision
			})
		)
		.on('error', sass.logError)
		.pipe(autoprefixer(config.BROWSERS_LIST))
		.pipe(lineec())
		//.pipe(mmq({ log: true })) // Merge Media Queries
		.pipe(beautify())
		.pipe(gulp.dest(config.styleDestination))
		.pipe(filter('**/*.css'))
		.pipe(browserSync.stream())
		.pipe(notify({ message: '✅ Style Build ➨ Completed!', onLast: true }));
});

/**
  * Task: `images`.
  *
  * Minifies PNG, JPEG, GIF and SVG images.
  *
  */
gulp.task('images', () => {
	return (
		del('./src/images/**/*.db'),
		gulp
			.src(config.imgSRC)
			.pipe(newer(config.imgSRC))
			.pipe(
				cache(
					imagemin(
						[
							imagemin.gifsicle({ interlaced: true }),
							imagemin.jpegtran({ progressive: true }),
							imagemin.optipng({ optimizationLevel: 3 }), // 0-7 low-high.
							imagemin.svgo({
								plugins: [ { removeViewBox: true }, { cleanupIDs: false } ]
							})
						],
						{
							verbose: true
						}
					)
				)
			)
			.pipe(gulp.dest(config.imgDST))
			.pipe(notify({ message: '✅ Images ➨ Completed!', onLast: true }))
	);
});

/**
  * Task: `clear-images-cache`.
  *
  * Deletes the images cache. By running the next "images" task,
  * each image will be regenerated.
  */
gulp.task('clearCache', function(done) {
	return cache.clearAll(done);
});

/**
  * Watch Tasks.
  *
  * Watches for file changes and runs specific tasks.
  */
gulp.task(
	'run',
	gulp.parallel('styles', 'images', browsersync, () => {
		gulp.watch(config.watchPhp, reload);
		gulp.watch(config.watchHtml, reload);
		gulp.watch(config.watchStyles, gulp.parallel('styles'), reload);
		gulp.watch(config.imgSRC, gulp.series('images', reload));
	})
);

/**
  * Clean Task.
  *
  * Delete files and folders
  */
gulp.task('clean', () => {
	return del(config.build + '**/*');
});

/**
  * Build files Task.
  *
  * Build files and folders in the dist directory
  */
gulp.task('buildFiles', () => {
	return gulp
		.src(config.buildInclude)
		.pipe(gulp.dest(config.build + config.projectName + '/'))
		.pipe(notify({ message: '✅ Copy Files ➨ Completed!', onLast: true }));
});

/**
  * Build Zip Task.
  *
  * Build Zip from the Build directory in dist
  */
gulp.task('buildZip', () => {
	return gulp
		.src(config.build + '/**/*')
		.pipe(chmod(0o755, 0o755))
		.pipe(zip(config.projectName + '-' + config.productVersion + '.zip'))
		.pipe(gulp.dest(config.buildFinalZip))
		.pipe(notify({ message: '✅ Project Zip ➨ Completed!', onLast: true }));
});

/**
  * Build files from scratch Task.
  *
  * Build production file from the dist directory in root
  */
gulp.task(
	'build',
	gulp.series(
		'clean',
		'buildStyles',
		'images',
		'buildFiles',
		'buildZip',
		function(done) {
			done();
		}
	)
);
