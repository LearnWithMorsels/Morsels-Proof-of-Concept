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
		addsrc = require( 'gulp-add-src' ),
		extend = require( 'gulp-multi-extend' ),
		babel = require( 'gulp-babel' ),
		foreach = require( 'gulp-foreach' );

var objConfig = JSON.parse( fs.readFileSync( './src/app/config.json' ) );

gulp.task( 'core-js', () => {
	return gulp.src( ['./src/core/js/**/*.js', '!./src/core/js/vendor/**/*.js'] )
			.pipe(
				foreach(
					function( stream, file ) {
						var strFile = file.history[0].replace( new RegExp( '^' + file.base ), '' ).replace( /^\//, '' ),
								strAppFile = file.base.replace( /\/$/, '' ) + '/app/' + strFile;

						if( fs.existsSync( strAppFile ) ) {
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
							return stream;
						}
					}
				)
			)
			.pipe( using() )
			.pipe(
				babel(
					{
						presets: ['es2015']
					}
				)
			)
			//.pipe( uglify( { preserveComments: 'license' } ) )
			.pipe( gulp.dest( './build/js' ) );
});

gulp.task( 'vendor-js', () => {
	return gulp.src(
				[
					'./src/core/js/vendor/**/*.js',
					'./node_modules/systemjs/dist/system.js',
					'./node_modules/babel-polyfill/dist/polyfill.js'
				]
			)
			.pipe( using() )
			//.pipe( uglify( { preserveComments: 'license' } ) )
			.pipe( gulp.dest( './build/js/vendor' ) );
});

gulp.task( 'cards-js', () => {
	return gulp.src( './src/cards/**/js/**/*.js' )
			.pipe(
				foreach(
					function( stream, file ) {
						var strFile = file.history[0].replace( new RegExp( '^' + file.base ), '' ).replace( /^\//, '' ),
								strAppFile = file.base.replace( /\/cards\/$/, '' ) + '/app/cards/' + strFile;

						console.log( '===================================' );
						//console.log( JSON.stringify( file ) );
						console.log( file.history[0] );
						//console.log( file.base );
						//console.log( strFile );
						console.log( strAppFile );

						if( fs.existsSync( strAppFile ) ) {
							console.log( 'App file found' );
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
							console.log( 'Stock file used' );
							return stream;
						}
					}
				)
			)
			.pipe( using() )
			.pipe( jshint() )
			.pipe( jshint.reporter( 'default' ) )
			.pipe(
				rename(
					function( path ) {
						path.dirname = path.dirname.replace( '/js', '' );
						return path;
					}
				)
			)
			//.pipe( uglify( { preserveComments: 'license' } ) )
			.pipe( gulp.dest( './build/js/cards' ) );
});

gulp.task( 'interactions-js', () => {
	return gulp.src( './src/interactions/**/js/**/*.js' )
			.pipe(
				foreach(
					function( stream, file ) {
						var strFile = file.history[0].replace( new RegExp( '^' + file.base ), '' ).replace( /^\//, '' ),
								strAppFile = file.base.replace( /\/interactions\/$/, '' ) + '/app/interactions/' + strFile;

						console.log( '===================================' );
						//console.log( JSON.stringify( file ) );
						console.log( file.history[0] );
						//console.log( file.base );
						//console.log( strFile );
						console.log( strAppFile );

						if( fs.existsSync( strAppFile ) ) {
							console.log( 'App file found' );
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
							console.log( 'Stock file used' );
							return stream;
						}
					}
				)
			)
			.pipe( using() )
			.pipe( jshint() )
			.pipe( jshint.reporter( 'default' ) )
			.pipe(
				rename(
					function( path ) {
						path.dirname = path.dirname.replace( '/js', '' );
						return path;
					}
				)
			)
			//.pipe( uglify( { preserveComments: 'license' } ) )
			.pipe( gulp.dest( './build/js/interactions' ) );
});

gulp.task( 'css', () => {
	return gulp.src( 'ajax/scss/twistajax.scss' )
			.pipe( using() )
			.pipe( sourcemaps.init() )
			.pipe( sass( { errLogToConsole: true, outputStyle: 'compressed' } ) )
			.pipe( rename( 'app.min.css' ) )
			.pipe( sourcemaps.write( './' ) )
			.pipe( gulp.dest( './build/css' ) );
});

gulp.task( 'resources', () => {
	return gulp.src( ['./src/app/resources/**/*'] )
			.pipe( using() )
			.pipe( gulp.dest( './build/app/resources' ) );
});

gulp.task( 'config', () => {
	return gulp.src( ['./src/app/config.json'] )
			.pipe( using() )
			.pipe( gulp.dest( './build/app' ) );
});

gulp.task( 'data', () => {
	return gulp.src( ['./src/app/course/*.json'] )
			.pipe( extend( './src/app/course/' + objConfig.languages.primary + '.json' ) )
			.pipe( using() )
			.pipe( gulp.dest( './build/app/course' ) );
});

gulp.task( 'index', () => {
	return gulp.src( ['./src/theme/' + objConfig.theme + '/index.html'] )
			.pipe( gulp.dest( './build' ) );
});

//gulp.task( 'js', ['core-js', 'vendor-js', 'cards-js', 'interactions-js'] );

gulp.task('js', ['vendor-js'], () => {
	return gulp.src(
			[
				'./src/core/js/**/*.js',
				'!./src/core/js/vendor/**/*.js',
				'./src/cards/*/js/*/**.js',
				'./src/interactions/*/js/*/**.js'
			]
		)
		.pipe( sourcemaps.init() )
		.pipe( using() )
		.pipe(
			babel(
				{
					presets: ['es2015']
				}
			)
		)
		.pipe( addsrc.prepend( './src/core/js/**/*.js' ) )
		.pipe( using() )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( gulp.dest( './build/js' ) );
});

gulp.task( 'watch-js', ['js'], () => {
	return gulp.watch( './src/core/js/**/*.js', ['js'] );
});

gulp.task( 'default', ['index', 'js', 'css', 'resources', 'config', 'data'] );