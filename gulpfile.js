const fs = require( 'fs' ),
		gulp = require( 'gulp' ),
		addsrc = require( 'gulp-add-src' ),
		babel = require( 'gulp-babel' ),
		change = require( 'gulp-change' ),
		declare = require( 'gulp-declare' ),
		compileHandlebars = require( 'gulp-compile-handlebars' ),
		concat = require( 'gulp-concat' ),
		fileOverride = require( 'gulp-file-override' ),
		foreach = require( 'gulp-foreach' ),
		handlebars = require( 'gulp-handlebars' ),
		jsdoc = require( 'gulp-jsdoc3' ),
		jshint = require( 'gulp-jshint' ),
		merge = require( 'merge' ),
		extend = require( 'gulp-multi-extend' ),
		rename = require( 'gulp-rename' ),
		replace = require( 'gulp-replace' ),
		sass = require( 'gulp-sass' ),
		sourcemaps = require( 'gulp-sourcemaps' ),
		uglify = require( 'gulp-uglify' ),
		using = require( 'gulp-using' ),
		mergeStream = require( 'merge-stream' ),
		wrap = require( 'gulp-wrap' ),
		browserSync = require( 'browser-sync' ).create();

var objConfig = JSON.parse( fs.readFileSync( './src/app/config.json' ) ),
		objPrimaryContent = './src/app/course/' + objConfig.languages.primary + '.json';

gulp.task( 'index', () => {
	return gulp.src( './src/core/views/index.hbs' )
			.pipe( compileHandlebars( {
				config: objConfig,
				content: objPrimaryContent
			}, {
				ignorePartials: false,
				//batch : ['./src/partials'],
				helpers : {
					/*capitals : function(str){
						return str.toUpperCase();
					}*/
				}
			} ) )
			.pipe( rename( 'index.html' ) )
			.pipe( gulp.dest( './build' ) );
} );

gulp.task( 'watch-index', () => {
	return gulp.watch( './src/core/views/index.hbs', ['index'] );
} );

gulp.task( 'templates', () => {
	var core = gulp.src( './src/core/views/templates/**/*.hbs' )
					.pipe( fileOverride( 'core/views', 'app/core/views' ) )
					.pipe(
						rename(
							function( path ) {
								path.dirname += '/core';
								return path;
							}
						)
					),
			activities = gulp.src( './src/activities/*/templates/**/*.hbs' )
					.pipe( fileOverride( 'activities/*/templates', 'app/activities/$1/templates' ) )
					.pipe(
						rename(
							function( path ) {
								path.dirname = 'activities/' + path.dirname.replace( /\/templates$/, '' );
								return path;
							}
						)
					),
			cards = gulp.src( './src/cards/*/templates/**/*.hbs' )
					.pipe( fileOverride( 'cards/*/templates', 'app/cards/$1/templates' ) )
					.pipe(
							rename(
									function( path ) {
										path.dirname = 'cards/' + path.dirname.replace( /\/templates$/, '' );
										return path;
									}
							)
					),
			extensions = gulp.src( './src/extensions/*/templates/**/*.hbs' )
					.pipe( fileOverride( 'extensions/*/templates', 'app/extensions/$1/templates' ) )
					.pipe(
						rename(
							function( path ) {
								path.dirname = 'extensions/' + path.dirname.replace( /\/templates$/, '' );
								return path;
							}
						)
					),
			theme = gulp.src( './src/theme/*/templates/**/*.hbs' )
					.pipe( fileOverride( 'theme/*/templates', 'app/theme/$1/templates' ) )
					.pipe(
						rename(
							function( path ) {
								path.dirname = 'theme/' + path.dirname.replace( new RegExp( objConfig.theme + '\/templates$' ), '' );
								return path;
							}
						)
					);

	return mergeStream( core, activities, cards, extensions, theme )
			.pipe( gulp.dest( './build/templates' ) );

	// return mergeStream( core, activities, cards, extensions )
	// 		.pipe( handlebars() )
	// 		.pipe( wrap( 'Handlebars.template(<%= contents %>)' ) )
	// 		.pipe(
	// 			declare(
	// 				{
	// 					namespace: 'Morsels.views',
	// 					noRedeclare: true, // Avoid duplicate declarations 
	// 				}
	// 			)
	// 		)
	// 		.pipe( addsrc.prepend( './node_modules/handlebars/dist/handlebars.js' ) )
	// 		.pipe( concat( 'views.js' ) )
	// 		.pipe( gulp.dest( './build/js/' ) );
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
			], ['templates'], browserSync.reload );
} );

gulp.task( 'core-js', () => {
	var core = gulp.src( './src/core/js/**/*.js' )
					.pipe( fileOverride( 'core/js', 'app/core/js' ) ),
			activities = gulp.src( './src/activities/*/js/**/*.js' )
					.pipe( fileOverride( 'activities/*/js', 'app/activities/$1/js' ) )
					.pipe(
							rename(
									function( path ) {
										path.dirname = 'activities/' + path.dirname.replace( /\/js$/, '' );
										return path;
									}
							)
					),
			cards = gulp.src( './src/cards/*/js/**/*.js' )
					.pipe( fileOverride( 'cards/*/js', 'app/cards/$1/js' ) )
					.pipe(
							rename(
									function( path ) {
										path.dirname = 'cards/' + path.dirname.replace( /\/js$/, '' );
										return path;
									}
							)
					),
			extensions = gulp.src( './src/extensions/*/js/**/*.js' )
					.pipe( fileOverride( 'extensions/*/js', 'app/extensions/$1/js' ) )
					.pipe(
							rename(
									function( path ) {
										path.dirname = 'extensions/' + path.dirname;
										return path;
									}
							)
					);

	return mergeStream( core, activities, cards, extensions )
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
	return gulp.watch( './src/core/js/**/*.js', ['core-js'], browserSync.reload );
} );

gulp.task( 'vendor-js', () => {
	return gulp.src( [
		'./node_modules/babel-polyfill/dist/polyfill.min.js',
		'./node_modules/systemjs/dist/system.js',
		'./node_modules/signals/dist/signals.min.js',
		'./node_modules/crossroads/dist/crossroads.min.js',
		'./node_modules/handlebars/dist/handlebars.js',
		'./node_modules/handlebars.binding/dist/handlebars.binding.min.js',
		'./node_modules/jquery/dist/jquery.min.js',
		'./node_modules/material-design-lite/dist/material.min.js'
	] )
			//.pipe( using() )
			.pipe( sourcemaps.init() )
			// .pipe( concat( 'vendor.js' ) )
			.pipe( sourcemaps.write( './' ) )
			.pipe( gulp.dest( './build/js/vendor' ) );
			//.pipe( gulp.dest( './build/js' ) );
} );

gulp.task( 'css', () => {
	var theme = gulp.src( './src/theme/' + objConfig.theme + '/sass/**/*.scss' )
					.pipe( sourcemaps.init() )
					.pipe( sass( {errLogToConsole: true, outputStyle: 'compressed'} ) ),
			activities = gulp.src( './src/activities/*/sass/**/*.scss' )
					.pipe( fileOverride( 'activities/*/sass', 'app/activities/$1/sass' ) )
					.pipe( sourcemaps.init() )
					.pipe( sass( {errLogToConsole: true, outputStyle: 'compressed'} ) )
					.pipe( concat( 'activities.min.css' ) ),
			cards = gulp.src( './src/cards/*/sass/**/*.scss' )
					.pipe( fileOverride( 'cards/*/sass', 'app/cards/$1/sass' ) )
					.pipe( sourcemaps.init() )
					.pipe( sass( {errLogToConsole: true, outputStyle: 'compressed'} ) )
					.pipe( concat( 'cards.min.css' ) ),
			extensions = gulp.src( './src/extensions/*/sass/**/*.scss' )
				.pipe( fileOverride( 'extensions/*/sass', 'app/extensions/$1/sass' ) )
					.pipe( sourcemaps.init() )
					.pipe( sass( {errLogToConsole: true, outputStyle: 'compressed'} ) )
					.pipe( concat( 'extensions.min.css' ) );

	return mergeStream( theme, activities, cards, extensions )
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
			.pipe( gulp.dest( './build/css' ) )
        	.pipe( browserSync.stream( { match: '**/*.css' } ) );
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
	return gulp.watch( './src/app/course/*.json', ['data'], browserSync.reload );
} );

gulp.task( 'docs', () => {
	return gulp.src( './src/core/js/**/*.js' )
			.pipe( jsdoc( { opts: { destination: './docs/core/' } } ) );
} );

gulp.task( 'browser-sync', function() {
    browserSync.init(
		{
			server: {
				baseDir: './build'
			}
    	}
	);
} );

gulp.task( 'js', ['core-js', 'vendor-js'] );

gulp.task( 'watch', ['default', 'watch-index', 'watch-templates', 'watch-core-js', 'watch-css', 'watch-resources', 'watch-config', 'watch-data'] );

gulp.task( 'dev', ['default', 'watch', 'browser-sync'] );

gulp.task( 'default', ['index', 'templates', 'js', 'css', 'resources', 'config', 'data'] );