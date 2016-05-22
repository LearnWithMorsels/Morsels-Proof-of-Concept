const fs = require( 'fs' ),
		gulp = require( 'gulp' ),
		addsrc = require( 'gulp-add-src' ),
		babel = require( 'gulp-babel' ),
		change = require( 'gulp-change' ),
		concat = require( 'gulp-concat' ),
		foreach = require( 'gulp-foreach' ),
		jsdoc = require( 'gulp-jsdoc3' ),
		jshint = require( 'gulp-jshint' ),
		extend = require( 'gulp-multi-extend' ),
		rename = require( 'gulp-rename' ),
		replace = require( 'gulp-replace' ),
		sass = require( 'gulp-sass' ),
		sourcemaps = require( 'gulp-sourcemaps' ),
		uglify = require( 'gulp-uglify' ),
		using = require( 'gulp-using' ),
		merge = require( 'merge-stream' );

var objConfig = JSON.parse( fs.readFileSync( './src/app/config.json' ) ),
		appOverrides = function( stream, file, folder ) {
			var strFile = file.history[0].replace( new RegExp( '^' + file.base ), '' ).replace( /^\//, '' ),
					regex = new RegExp( '\/' + ( folder ? folder + '\/' : '' ) + '$' ),
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
	return gulp.src( './src/core/views/index.html' )
			.pipe( gulp.dest( './build' ) );
} );

gulp.task( 'watch-index', () => {
	return gulp.watch( './src/core/views/index.html', ['index'] );
} );

gulp.task( 'templates', () => {
	var core = gulp.src( './src/core/views/templates/**/*.hbs' )
					.pipe(
							foreach(
									function( stream, file ) {
										return appOverrides( stream, file, 'core/views/templates' );
									}
							)
					),
			activities = gulp.src( './src/activities/*/templates/**/*.hbs' )
					.pipe(
							foreach(
									function( stream, file ) {
										return appOverrides( stream, file, 'activities' );
									}
							)
					)
					.pipe(
							rename(
									function( path ) {
										path.dirname = 'activities/' + path.dirname.replace( /\/templates$/, '' );
										return path;
									}
							)
					),
			cards = gulp.src( './src/cards/*/templates/**/*.hbs' )
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
										path.dirname = 'cards/' + path.dirname.replace( /\/templates$/, '' );
										return path;
									}
							)
					),
			extensions = gulp.src( './src/extensions/*/templates/**/*.hbs' )
					.pipe(
							foreach(
									function( stream, file ) {
										return appOverrides( stream, file, 'extensions' );
									}
							)
					)
					.pipe(
							rename(
									function( path ) {
										path.dirname = 'extensions/' + path.dirname.replace( /\/templates$/, '' );
										return path;
									}
							)
					);

	return merge( core, activities, cards, extensions )
			.pipe( gulp.dest( './build/templates' ) );
} );

gulp.task( 'watch-templates', () => {
	return gulp.watch(
			[
				'./src/core/views/templates/**/*.hbs',
				'./src/app/core/views/templates/**/*.hbs',
				'./src/cards/*/templates/**/*.hbs',
				'./src/app/cards/*/templates/**/*.hbs',
				'./src/extensions/*/templates/**/*.hbs',
				'./src/app/extensions/*/templates/**/*.hbs',
				'./src/activities/*/templates/**/*.hbs',
				'./src/app/activities/*/templates/**/*.hbs'
			], ['templates'] );
} );

gulp.task( 'core-js', () => {
	var core = gulp.src( './src/core/js/**/*.js' )
					.pipe(
							foreach(
									function( stream, file ) {
										return appOverrides( stream, file );
									}
							)
					),
			activities = gulp.src( './src/activities/*/js/**/*.js' )
					.pipe(
							foreach(
									function( stream, file ) {
										return appOverrides( stream, file, 'activities' );
									}
							)
					)
					.pipe(
							rename(
									function( path ) {
										path.dirname = 'activities/' + path.dirname.replace( /\/js$/, '' );
										return path;
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
			extensions = gulp.src( './src/extensions/*/js/**/*.js' )
					.pipe(
							foreach(
									function( stream, file ) {
										return appOverrides( stream, file, 'extensions' );
									}
							)
					)
					.pipe(
							rename(
									function( path ) {
										path.dirname = 'extensions/' + path.dirname;
										return path;
									}
							)
					);

	return merge( core, activities, cards, extensions )
			.pipe( sourcemaps.init() )
			.pipe(
					babel(
							{
								presets: ['es2015']
							}
					)
			)
			.pipe( uglify( {preserveComments: 'license'} ) )
			.pipe( sourcemaps.write( './' ) )
			.pipe( gulp.dest( './build/js' ) );
} );

gulp.task( 'watch-core-js', () => {
	return gulp.watch( './src/core/js/**/*.js', ['core-js'] );
} );

gulp.task( 'vendor-js', () => {
	return gulp.src( [
		'./node_modules/babel-polyfill/dist/polyfill.min.js',
		'./node_modules/crossroads/dist/crossroads.min.js',
		'./node_modules/handlebars/dist/handlebars.js',
		'./node_modules/jquery/dist/jquery.min.js',
		'./node_modules/material-design-lite/dist/material.min.js',
		'./node_modules/signals/dist/signals.min.js',
		'./node_modules/systemjs/dist/system.js'
	] )
	//.pipe( using() )
	//.pipe( sourcemaps.init() )
	//.pipe( sourcemaps.write( './' ) )
			.pipe( gulp.dest( './build/js/vendor' ) );
} );

gulp.task( 'css', () => {
	var theme = gulp.src( './src/theme/' + objConfig.theme + '/sass/**/*.scss' )
					.pipe( sourcemaps.init() )
					.pipe( sass( {errLogToConsole: true, outputStyle: 'compressed'} ) ),
			activities = gulp.src( './src/activities/*/sass/**/*.scss' )
					.pipe( sourcemaps.init() )
					.pipe( sass( {errLogToConsole: true, outputStyle: 'compressed'} ) )
					.pipe( concat( 'activities.min.css' ) ),
			cards = gulp.src( './src/cards/*/sass/**/*.scss' )
					.pipe( sourcemaps.init() )
					.pipe( sass( {errLogToConsole: true, outputStyle: 'compressed'} ) )
					.pipe( concat( 'cards.min.css' ) ),
			extensions = gulp.src( './src/extensions/*/sass/**/*.scss' )
					.pipe( sourcemaps.init() )
					.pipe( sass( {errLogToConsole: true, outputStyle: 'compressed'} ) )
					.pipe( concat( 'extensions.min.css' ) );

	return merge( theme, activities, cards, extensions )
			.pipe( concat( 'course.min.css' ) )
			.pipe( addsrc(
					[
						'./node_modules/material-design-lite/dist/material.blue_grey-red.min.css',
						'./node_modules/material-design-lite/dist/assets/prism-default.css',
						'./node_modules/material-design-lite/dist/assets/main.css',
						'./node_modules/material-design-lite/dist/assets/components.css'
					]
			) )
			.pipe( sourcemaps.write( './' ) )
			.pipe( gulp.dest( './build/css' ) );
} );

gulp.task( 'watch-css', () => {
	return gulp.watch( './src/theme/' + objConfig.theme + '/sass/**/*.scss', ['css'] );
} );

gulp.task( 'resources', () => {
	return gulp.src( './src/app/resources/**/*' )
			.pipe( gulp.dest( './build/app/resources' ) );
} );

gulp.task( 'watch-resources', () => {
	return gulp.watch( './src/app/resources/**/*', ['resources'] );
} );

gulp.task( 'config', () => {
	return gulp.src( './src/app/config.json' )
			.pipe( gulp.dest( './build/app' ) );
} );

gulp.task( 'watch-config', () => {
	return gulp.watch( './src/app/config.json', ['config'] );
} );

gulp.task( 'data', () => {
	return gulp.src( './src/app/course/*.json' )
			.pipe( extend( './src/app/course/' + objConfig.languages.primary + '.json' ) )
			.pipe( gulp.dest( './build/app/course' ) );
} );

gulp.task( 'watch-data', () => {
	return gulp.watch( './src/app/course/*.json', ['data'] );
} );

gulp.task( 'docs', () => {
	return gulp.src( './src/core/js/**/*.js' )
			.pipe( jsdoc( {opts: {destination: './docs/core/'}} ) );
} );

gulp.task( 'js', ['core-js', 'vendor-js'] );

gulp.task( 'watch', ['default', 'watch-index', 'watch-templates', 'watch-core-js', 'watch-css', 'watch-resources', 'watch-config', 'watch-data'] );

gulp.task( 'default', ['index', 'templates', 'js', 'css', 'resources', 'config', 'data'] );