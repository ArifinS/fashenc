/**
 * Gulp Configuration File
 *
 * @package RT_Team
 */


module.exports = {
	projectName    : 'fashenc',
	projectURL     : 'http://localhost/',
	productURL     : './',
	productVersion : '1.0.0',
	browserAutoOpen: true,
	injectChanges  : true,

	// Style options.
	styleSRC        : './scss/main.scss',
	styleDestination: './css',
	outputStyle     : 'expanded',
	errLogToConsole : true,
	precision       : 10,

	// Images options.
	imgSRC: './media-src/**/*.{png,jpg,gif,svg}',
	imgDST: './media',

	// Build options
	build       : './dist/',
	buildInclude: [
		// include common file types
		'**/*.php',
		'**/*.html',
		'**/*.css',
		'**/*.js',
		'**/*.svg',
		'**/*.png',
		'**/*.jpg',
		'**/*.ico',
		'**/*.gif',
		'**/*.ttf',
		'**/*.otf',
		'**/*.eot',
		'**/*.woff',
		'**/*.woff2',
		'**/*.pot',
		'**/*/LICENSE',

		// exclude files and folders
		'!**/.*',
		'!node_modules/**/*',
		'!need-to-check/**/*',
		'!dist/**/*',
		'!LICENSE.txt',
		'!project.config.js',
		'!gulpfile.js',
		'!assets/raw/**/*',
		'!src/**/*',
		'!webpack.config.js',
		'!phpcs.xml.dist',
		'!composer.json',
		'!composer.lock',
		'!package.lock',
		'!package-lock.json',
		'!webpack.mix.js',
		'!media-src/**/*',
	],
	buildFinalZip: './dist/',

	// Watch files paths.
	watchStyles  : './scss/**/*.scss',
	watchJsCustom: './js/**/*.js',
	watchPhp     : './**/*.php',
	watchHtml    : './**/*.html',

	// Browsers for autoprefixing.
	BROWSERS_LIST: [
		'last 2 version',
		'> 1%',
		'ie >= 11',
		'last 2 Android versions',
		'last 2 ChromeAndroid versions',
		'last 2 Chrome versions',
		'last 2 Firefox versions',
		'last 2 Safari versions',
		'last 2 iOS versions',
		'last 2 Edge versions',
		'last 2 Opera versions'
	]
};
