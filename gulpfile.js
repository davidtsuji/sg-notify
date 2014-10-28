var gulp = require( 'gulp' ),
	autoprefixer = require( 'gulp-autoprefixer' ),
	jshint = require( 'gulp-jshint' ),
	jshintReporter = require( "jshint-stylish" ),
	less = require( "gulp-less" ),
	rename = require( 'gulp-rename' ),
	mkdirp = require( 'mkdirp' ),
	shell = require( 'gulp-shell' ),
	uglify = require( 'gulp-uglify' );

gulp.task( "jshint", function () {
	return gulp.src( [ "./src/scripts/**/*.js" ] )
		.pipe( jshint() )
		.pipe( jshint.reporter( jshintReporter ) );
} );

gulp.task( 'scripts/app/browserify', function () {
	mkdirp( 'dist' );
	var stream = gulp.src( '' )
		.pipe( shell( [
			'./node_modules/.bin/browserify src/scripts/index.js -s sgNotify -o dist/sg-notify.js'
		] ) );

	if ( GLOBAL.livereload ) stream.pipe( livereload() );
	return stream;
} );

gulp.task( 'scripts/app/minify', [ 'scripts/app/browserify' ], function () {
	mkdirp( 'dist' );
	var stream = gulp.src( 'dist/sg-notify.js' )
		.pipe( uglify() )
		.pipe( rename( 'sg-notify.min.js' ) )
		.pipe( gulp.dest( 'dist' ) );

	if ( GLOBAL.livereload ) stream.pipe( livereload() );
	return stream;
} );

gulp.task( 'styles/app', function () {
	var stream = gulp.src( './src/styles/index.less' )
		.pipe( less() )
		.pipe( autoprefixer() )
		.pipe( rename( 'sg-notify.css' ) )
		.pipe( gulp.dest( 'dist' ) );

	if ( GLOBAL.livereload ) stream.pipe( livereload() );
	return stream;
} );

gulp.task( 'watch', [ 'default' ], function () {
	if ( !GLOBAL.livereload ) GLOBAL.livereload = require( 'gulp-livereload' );
	livereload.listen();

	gulp.watch( [ './src/scripts/**/*' ], [ 'scripts/app' ] );
	gulp.watch( [ './src/styles/**/*' ], [ 'styles/app' ] );
} );

gulp.task( 'default', [ 'build', 'minify' ] );
gulp.task( 'build', [ 'scripts', 'styles' ] );
gulp.task( 'scripts', [ 'jshint', 'scripts/app' ] );
gulp.task( 'scripts/app', [ 'scripts/app/minify' ] );
gulp.task( 'styles', [ 'styles/app' ] );
gulp.task( 'minify', [ 'scripts/app/minify' ] );
gulp.task( 'run', [ 'build', 'watch' ] );