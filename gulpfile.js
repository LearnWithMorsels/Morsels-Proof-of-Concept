const gulp = require( 'gulp' ),
		fs = require( 'fs' ),
		jshint = require( 'gulp-jshint' ),
		sass = require( 'gulp-sass' ),
		uglify = require( 'gulp-uglify' ),
		rename = require( 'gulp-rename' ),
		replace = require( 'gulp-replace' ),
		using = require( 'gulp-using' ),
		sourcemaps = require( 'gulp-sourcemaps' ),
		change = require( 'gulp-change' ),
		extend = require( 'gulp-multi-extend' ),
		babel = require( 'gulp-babel' ),
		merge = require( 'merge-stream' ),
		foreach = require( 'gulp-foreach' );

var objConfig = JSON.parse( fs.readFileSync( './src/app/config.json' ) ),
		appOverrides = function( stream, file, folder ) {
			var strFile = file.history[0].replace( new RegExp( '^' + file.base ), '' ).replace( /^\//, '' ),
					regex = new RegExp( '\/' + ( folder ? folder + '/' : '' ) + '$' ),
					strAppFile = file.base.replace( regex, '' ) + '/app/' + ( folder ? folder + '/' : '' ) + strFile;

			if( fs.existsSync( strAppFile ) ) {
				console.log( '[ APP ] ' + strAppFile );
				var strAppFileContents = fs.readFileSync( strAppFile );

				return stream
						.pipe(
								change(
										function() {
											return strAppFileContents;
										}
								)
						);
			} else {
				console.log( '[STOCK] ' + file.history[0] );
				return stream;
			}
		};

gulp.task( 'index', () => {
	return gulp.src( ['./src/core/index.html'] )
			.pipe( gulp.dest( './build' ) );
} );

gulp.task( 'core-js', () => {
	var core = gulp.src( ['./src/core/js/**/*.js', '!./src/core/js/vendor/**/*.js'] )
					.pipe(
							foreach(
									function( stream, file ) {
										return appOverrides( stream, file );
									}
							)
					),
			cards = gulp.src( './src/cards/*/js/**/*.js' )
					.pipe(
							foreach(
									function( stream, file ) {
										return appOverrides( stream, file, 'cards' );
									}
							)
					)
					.pipe(
							rename(
									function( path ) {
										path.dirname = 'cards/' + path.dirname.replace( /\/js$/, '' );
										return path;
									}
							)
					),
			interactions = gulp.src( './src/interactions/*/js/**/*.js' )
					.pipe(
							foreach(
									function( stream, file ) {
										return appOverrides( stream, file, 'interactions' );
									}
							)
					)
					.pipe(
							rename(
									function( path ) {
										path.dirname = 'interactions/' + path.dirname.replace( /\/js$/, '' );
										return path;
									}
							)
					);

	return merge( core, cards, interactions )
			.pipe( sourcemaps.init() )
			.pipe(
					babel(
							{
								presets: ['es2015']
							}
					)
			)
			//.pipe( uglify( { preserveComments: 'license' } ) )
			.pipe( sourcemaps.write( './' ) )
			.pipe( gulp.dest( './build/js' ) );
} );

gulp.task( 'watch-core-js', ['core-js'], () => {
	return gulp.watch( ['./src/core/js/**/*.js', '!./src/core/js/vendor/**/*.js'], ['core-js'] );
} );

gulp.task( 'vendor-js', () => {
	return gulp.src( [
				'./src/core/js/vendor/**/*.js',
				'./node_modules/systemjs/dist/system.js',
				'./node_modules/babel-polyfill/dist/polyfill.js'
			] )
			//.pipe( using() )
			//.pipe( uglify( { preserveComments: 'license' } ) )
			.pipe( gulp.dest( './build/js/vendor' ) );
} );

gulp.task( 'watch-vendor-js', ['vendor-js'], () => {
	return gulp.watch( './src/core/js/vendor/**/*.js', ['vendor-js'] );
} );

gulp.task( 'css', () => {
	return gulp.src( './src/theme/' + objConfig.theme + '/sass/**/*' )
			//.pipe( using() )
			.pipe( sourcemaps.init() )
			.pipe( sass( { errLogToConsole: true, outputStyle: 'compressed' } ) )
			.pipe( rename( 'theme.min.css' ) )
			.pipe( sourcemaps.write( './' ) )
			.pipe( gulp.dest( './build/css' ) );
} );

gulp.task( 'watch-css', ['css'], () => {
	return gulp.watch( './src/core/js/vendor/**/*.js', ['vendor-js'] );
} );

gulp.task( 'resources', () => {
	return gulp.src( './src/app/resources/**/*' )
			//.pipe( using() )
			.pipe( gulp.dest( './build/app/resources' ) );
} );

gulp.task( 'config', () => {
	return gulp.src( './src/app/config.json' )
			//.pipe( using() )
			.pipe( gulp.dest( './build/app' ) );
} );

gulp.task( 'data', () => {
	return gulp.src( './src/app/course/*.json' )
			.pipe( extend( './src/app/course/' + objConfig.languages.primary + '.json' ) )
			//.pipe( using() )
			.pipe( gulp.dest( './build/app/course' ) );
} );

gulp.task( 'js', ['core-js', 'vendor-js'] );

gulp.task( 'watch', ['watch-core-js', 'watch-vendor-js', 'watch-css'] );

gulp.task( 'default', ['index', 'js', 'css', 'resources', 'config', 'data'] );