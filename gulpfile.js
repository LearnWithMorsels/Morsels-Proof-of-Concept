const fs = require( 'fs' ),
	gulp = require( 'gulp' ),
	addsrc = require( 'gulp-add-src' ),
	babel = require( 'gulp-babel' ),
	change = require( 'gulp-change' ),
	declare = require( 'gulp-declare' ),
	handlebars = require( 'gulp-compile-handlebars' ),
	concat = require( 'gulp-concat' ),
	fileOverride = require( 'gulp-file-override' ),
	foreach = require( 'gulp-foreach' ),
	precompileHandlebars = require( 'gulp-handlebars' ),
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
		.pipe(
			handlebars(
				{
					config: objConfig,
					content: objPrimaryContent
				},
				{
					ignorePartials: false,
					//batch : ['./src/partials'],
					helpers : {
						/*capitals : function(str){
						 return str.toUpperCase();
						 }*/
					}
				}
			)
		)
		.pipe( rename( 'index.html' ) )
		.pipe( gulp.dest( './build' ) );
} );

gulp.task( 'views', () => {
	var core = gulp.src( './src/core/views/partials/**/*.hbs' )
			.pipe( fileOverride( 'core/views/partials', 'app/core/views/partials' ) )
			.pipe(
				rename(
					function( path ) {
						path.dirname = '/partials/' + path.dirname;
						return path;
					}
				)
			),
		activities = gulp.src( './src/activities/*/views/**/*.hbs' )
			.pipe( fileOverride( 'activities/*/views', 'app/activities/$1/views' ) )
			.pipe(
				rename(
					function( path ) {
						path.dirname = 'activities/' + path.dirname.replace( /\/views$/, '' );
						return path;
					}
				)
			),
		cards = gulp.src( './src/cards/*/views/**/*.hbs' )
			.pipe( fileOverride( 'cards/*/views', 'app/cards/$1/views' ) )
			.pipe(
				rename(
					function( path ) {
						path.dirname = 'cards/' + path.dirname.replace( /\/views$/, '' );
						return path;
					}
				)
			),
		extensions = gulp.src( './src/extensions/*/views/**/*.hbs' )
			.pipe( fileOverride( 'extensions/*/views', 'app/extensions/$1/views' ) )
			.pipe(
				rename(
					function( path ) {
						path.dirname = 'extensions/' + path.dirname.replace( /\/views$/, '' );
						return path;
					}
				)
			),
		theme = gulp.src( './src/theme/*/views/**/*.hbs' )
			.pipe( fileOverride( 'theme/*/views', 'app/theme/$1/views' ) )
			.pipe(
				rename(
					function( path ) {
						path.dirname = path.dirname.replace( new RegExp( objConfig.theme + '\/views$' ), '' );
						return path;
					}
				)
			);

	return mergeStream( core, activities, cards, extensions, theme )
		.pipe( gulp.dest( './build/views' ) );

	// return mergeStream( core, activities, cards, extensions, theme )
	// 		.pipe( precompileHandlebars() )
	// 		.pipe( wrap( 'Handlebars.template(<%= contents %>)' ) )
	// 		.pipe(
	// 			declare(
	// 				{
	// 					namespace: 'Morsels.views',
	// 					noRedeclare: true
	// 				}
	// 			)
	// 		)
	// 		.pipe( concat( 'views.js' ) )
	// 		.pipe( gulp.dest( './build/js/' ) );
} );

gulp.task( 'js', () => {
	var core = gulp.src( './src/core/js/**/*.js' )
			.pipe( using() )
			.pipe( fileOverride( 'core/js', 'app/core/js' ) )
			.pipe( using() ),
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
			.pipe( addsrc.prepend( './src/core/js/cards.js' ) )
			.pipe( concat( 'cards.js' ) )
			/*.pipe(
				rename(
					function( path ) {
						path.dirname = 'cards/' + path.dirname.replace( /\/js$/, '' );
						return path;
					}
				)
			)*/,
		extensions = gulp.src( './src/extensions/*/js/**/*.js' )
			.pipe( fileOverride( 'extensions/*/js', 'app/extensions/$1/js' ) )
			.pipe(
				rename(
					function( path ) {
						path.dirname = 'extensions/' + path.dirname.replace( /\/js$/, '' );
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
		.pipe( uglify( { preserveComments: 'license' } ) )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( './build/js' ) );
} );

gulp.task( 'vendor', () => {
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
		.pipe( using() )
		.pipe( sourcemaps.init() )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( './build/js/vendor' ) );
} );

gulp.task( 'css', () => {
	return gulp.src(
		[
			'./src/theme/' + objConfig.theme + '/sass/**/*.scss',
			'./src/activities/**/*.scss',
			'./src/cards/**/*.scss',
			'./src/extensions/**/*.scss'
		]
	)
		.pipe( fileOverride( 'theme/*/sass', 'app/theme/$1/sass' ) )
		.pipe( fileOverride( 'activities/*/sass', 'app/activities/$1/sass' ) )
		.pipe( fileOverride( 'cards/*/sass', 'app/cards/$1/sass' ) )
		.pipe( fileOverride( 'extensions/*/sass', 'app/extensions/$1/sass' ) )
		.pipe( sourcemaps.init() )
		.pipe( sass( { errLogToConsole: true, outputStyle: 'compressed' } ) )
		.pipe( concat( 'course.min.css' ) )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( './build/css' ) )
		.pipe( browserSync.stream( { match: '**/*.css' } ) );
} );

gulp.task( 'resources', () => {
	return gulp.src( './src/app/resources/**/*' )
		.pipe( gulp.dest( './build/app/resources' ) );
} );

gulp.task( 'config', () => {
	return gulp.src( './src/app/config.json' )
		.pipe( gulp.dest( './build/app' ) );
} );

gulp.task( 'data', () => {
	return gulp.src( './src/app/course/*.json' )
		.pipe( extend( './src/app/course/' + objConfig.languages.primary + '.json' ) )
		.pipe( gulp.dest( './build/app/course' ) );
} );

gulp.task( 'docs', () => {
	return gulp.src( './src/core/js/**/*.js' )
		.pipe( jsdoc( { opts: { destination: './docs/core/' } } ) );
} );

gulp.task( 'dev', ['default'],
	() => {
		browserSync.init(
			{
				files: [
					'./build/css/*.css',
					'./build/js/**/*.js'
				],
				server: {
					baseDir: './build',
					//directory: true,
					index: 'index.html',
					logLevel: 'debug'
				}
			}
		);

		gulp.watch( './src/core/views/index.hbs', ['index'], browserSync.reload );
		gulp.watch(
			[
				'./src/core/views/partials/**/*.hbs',
				'./src/activities/*/views/**/*.hbs',
				'./src/cards/*/views/**/*.hbs',
				'./src/extensions/*/views/**/*.hbs',
				'./src/theme/*/views/**/*.hbs',
				'./src/app/core/views/partials/**/*.hbs',
				'./src/app/activities/*/views/**/*.hbs',
				'./src/app/cards/*/views/**/*.hbs',
				'./src/app/extensions/*/views/**/*.hbs',
				'./src/app/theme/*/views/**/*.hbs'
			], ['views'], browserSync.reload );
		gulp.watch( './src/**/*.js', ['js'], browserSync.reload );
		gulp.watch( './src/**/*.scss', ['css'] );
		gulp.watch( './src/app/resources/**/*', ['resources'] );
		gulp.watch( './src/app/config.json', ['config'], browserSync.reload );
		gulp.watch( './src/app/course/*.json', ['data'], browserSync.reload );
	}
);

gulp.task( 'default', ['index', 'views', 'js', 'vendor', 'css', 'resources', 'config', 'data'] );