"use strict";

var del = require( 'del' ),
	fs = require( 'fs' ),
	gulp = require( 'gulp' ),
	path = require( 'path' ),
	addsrc = require( 'gulp-add-src' ),
	babel = require( 'gulp-babel' ),
	change = require( 'gulp-change' ),
	declare = require( 'gulp-declare' ),
	handlebars = require( 'gulp-compile-handlebars' ),
	concat = require( 'gulp-concat' ),
	fileOverride = require( 'gulp-file-override' ),
	foreach = require( 'gulp-foreach' ),
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

gulp.task( 'app:index', () => {
	return gulp.src( './src/core/views/index.hbs' )
		.pipe(
			handlebars(
				{
					config: objConfig,
					content: objPrimaryContent
				}
			)
		)
		.pipe( rename( 'index.html' ) )
		.pipe( gulp.dest( './build' ) );
} );

gulp.task( 'app:views', () => {
	let core = gulp.src( './src/core/views/partials/**/*.hbs' )
			.pipe( fileOverride( 'core/views/partials', 'app/core/views/partials' ) )
			.pipe(
				rename(
					function( filepath ) {
						filepath.dirname = path.sep + 'partials' + path.sep + filepath.dirname;
						return filepath;
					}
				)
			),
		activities = gulp.src( './src/activities/*/views/**/*.hbs' )
			.pipe( fileOverride( 'activities/*/views', 'app/activities/$1/views' ) )
			.pipe(
				rename(
					function( filepath ) {
						filepath.dirname = 'activities' + path.sep + filepath.dirname.replace( new RegExp( '\\' + path.sep + 'views$' ), '' );
						return filepath;
					}
				)
			),
		cards = gulp.src( './src/cards/*/views/**/*.hbs' )
			.pipe( fileOverride( 'cards/*/views', 'app/cards/$1/views' ) )
			.pipe(
				rename(
					function( filepath ) {
						filepath.dirname = 'cards' + path.sep + filepath.dirname.replace( new RegExp( '\\' + path.sep + 'views$' ), '' );
						return filepath;
					}
				)
			),
		extensions = gulp.src( './src/extensions/*/views/**/*.hbs' )
			.pipe( fileOverride( 'extensions/*/views', 'app/extensions/$1/views' ) )
			.pipe(
				rename(
					function( filepath ) {
						filepath.dirname = 'extensions' + path.sep + filepath.dirname.replace( new RegExp( '\\' + path.sep + 'views$' ), '' );
						return filepath;
					}
				)
			),
		theme = gulp.src( './src/theme/*/views/**/*.hbs' )
			.pipe( fileOverride( 'theme/*/views', 'app/theme/$1/views' ) )
			.pipe(
				rename(
					function( filepath ) {
						filepath.dirname = filepath.dirname.replace( new RegExp( objConfig.theme + '\\' + path.sep + 'views$' ), '' );
						return filepath;
					}
				)
			);

	return mergeStream( core, activities, cards, extensions, theme )
		.pipe( gulp.dest( './build/views' ) );
} );

gulp.task( 'app:js', () => {
	let core = gulp.src(
		[
			'./src/core/js/**/*.js',
			'!./src/core/js/activities.js',
			'!./src/core/js/cards.js',
			'!./src/core/js/extensions.js'
		]
	)
			.pipe( fileOverride( 'core/js', 'app/core/js' ) ),
		activities = gulp.src( './src/activities/*/js/**/*.js' )
			.pipe( fileOverride( 'activities/*/js', 'app/activities/$1/js' ) )
			.pipe( addsrc.prepend( './src/core/js/activities.js' ) )
			.pipe( concat( 'activities.js' ) ),
		cards = gulp.src( './src/cards/*/js/**/*.js' )
			.pipe( fileOverride( 'cards/*/js', 'app/cards/$1/js' ) )
			.pipe( addsrc.prepend( './src/core/js/cards.js' ) )
			.pipe( concat( 'cards.js' ) ),
		extensions = gulp.src( './src/extensions/*/js/**/*.js' )
			.pipe( fileOverride( 'extensions/*/js', 'app/extensions/$1/js' ) )
			.pipe( addsrc.prepend( './src/core/js/extensions.js' ) )
			.pipe( concat( 'extensions.js' ) );

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

gulp.task( 'app:vendor', () => {
	return gulp.src( './node_modules/eventemitter3/index.js' )
		.pipe( rename( 'eventemitter3.js' ) )
		.pipe(
			addsrc(
				[
					'./node_modules/babel-polyfill/dist/polyfill.min.js',
					'./node_modules/crossroads/dist/crossroads.min.js',
					'./node_modules/jquery/dist/jquery.min.js',
					'./node_modules/handlebars/dist/handlebars.js',
					'./node_modules/handlebars.binding/dist/handlebars.binding.min.js',
					'./node_modules/material-design-lite/dist/material.min.js',
					'./node_modules/signals/dist/signals.min.js',
					'./node_modules/systemjs/dist/system.js'
				]
			)
		)
		.pipe( sourcemaps.init() )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( './build/js/vendor' ) );
} );

gulp.task( 'app:scss', () => {
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

gulp.task( 'app:resources', () => {
	return gulp.src( './src/app/resources/**/*' )
		.pipe( gulp.dest( './build/app/resources' ) );
} );

gulp.task( 'app:config', () => {
	return gulp.src( './src/app/config.json' )
		.pipe( gulp.dest( './build/app' ) );
} );

gulp.task( 'app:data', () => {
	return gulp.src( './src/app/course/*.json' )
		.pipe( extend( './src/app/course/' + objConfig.languages.primary + '.json' ) )
		.pipe( gulp.dest( './build/app/course' ) );
} );

gulp.task( 'docs', () => {
	return gulp.src( './src/core/js/**/*.js' )
		.pipe( jsdoc( { opts: { destination: './docs/core/' } } ) );
} );

gulp.task( 'clean', () => {
	return del(
		[ './build/**/*' ]
	);
});

gulp.task( 'dev', ['build'],
	() => {
		browserSync.init(
			{
				files: [
					'./build/css/*.css',
					'./build/js/**/*.js'
				],
				server: {
					baseDir: './build',
					directory: false,
					index: 'index.html',
					logLevel: 'debug'
				}
			}
		);

		gulp.watch( './src/core/views/index.hbs', ['app:index'], browserSync.reload );
		gulp.watch( './src/**/*.hbs', ['app:views'], browserSync.reload );
		gulp.watch( './src/**/*.js', ['app:js'], browserSync.reload );
		gulp.watch( './src/**/*.scss', ['app:scss'] );
		gulp.watch( './src/app/resources/**/*', ['app:resources'] );
		gulp.watch( './src/app/config.json', ['app:config'], browserSync.reload );
		gulp.watch( './src/app/course/*.json', ['app:data'], browserSync.reload );
	}
);

gulp.task( 'build', ['app:index', 'app:views', 'app:scss', 'app:resources', 'app:config', 'app:data', 'app:js', 'app:vendor'] );
