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
	xmlpoke = require( 'gulp-xmlpoke' ),
	mergeStream = require( 'merge-stream' ),
	wrap = require( 'gulp-wrap' ),
	zip = require( 'gulp-zip' ),
	browserSync = require( 'browser-sync' ).create();

var objConfig = JSON.parse( fs.readFileSync( './src/app/config.json' ) ),
	objPrimaryContent = './src/course/' + objConfig.languages.primary + '.json',
	timestamp = function() {
		return new Date().getTime();
	};

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

gulp.task( 'app:js', ['app:js:core', 'app:js:activities', 'app:js:cards', 'app:js:extensions'] );

gulp.task( 'app:js:core', () => {
	return gulp.src(
		[
			'./src/core/js/**/*.js',
			'!./src/core/js/activities.js',
			'!./src/core/js/cards.js'
		]
	)
		.pipe( fileOverride( 'core/js', 'app/core/js' ) )
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

gulp.task( 'app:js:activities', () => {
	return gulp.src( './src/activities/*/js/**/*.js' )
		.pipe( fileOverride( 'activities/*/js', 'app/activities/$1/js' ) )
		.pipe( addsrc.prepend( './src/core/js/activities.js' ) )
		.pipe( concat( 'activities.js' ) )
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

gulp.task( 'app:js:cards', () => {
	return gulp.src( './src/cards/*/js/**/*.js' )
		.pipe( fileOverride( 'cards/*/js', 'app/cards/$1/js' ) )
		.pipe( addsrc.prepend( './src/core/js/cards.js' ) )
		.pipe( concat( 'cards.js' ) )
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

gulp.task( 'app:js:extensions', ['app:config'], () => {
	return gulp.src( './src/extensions/*/js/**/*.js' )
		.pipe( fileOverride( 'extensions/*/js', 'app/extensions/$1/js' ) )
		.pipe(
			rename(
				function( filepath ) {
					filepath.dirname = filepath.dirname.replace( new RegExp( '\\' + path.sep + 'js$' ), '' );
					return filepath;
				}
			)
		)
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
		.pipe( gulp.dest( './build/js/extensions' ) );
} );

gulp.task( 'vendor', () => {
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
	return gulp.src( './src/course/resources/**/*' )
		.pipe( gulp.dest( './build/app/resources' ) );
} );

gulp.task( 'app:config', () => {
	objConfig = JSON.parse( fs.readFileSync( './src/app/config.json' ) );
	objPrimaryContent = './src/course/' + objConfig.languages.primary + '.json';

	objConfig.properties = {
		activities: {},
		cards: {},
		extensions: {}
	};

	return gulp.src(
		[
			'./src/activities/*/properties.json',
			'./src/cards/*/properties.json',
			'./src/extensions/*/properties.json'
		]
	)
		.pipe(
			foreach(
				( stream, file ) => {
					let fileProperties = JSON.parse( fs.readFileSync( file.base + file.relative ) ),
						group = file.base.replace( new RegExp( '\\' + path.sep + '$' ), '' ).split( path.sep ).pop(),
						item = file.relative.replace( new RegExp( '^\\' + path.sep ), '' ).split( path.sep ).shift();
					objConfig.properties[group][item] = fileProperties;
					fs.writeFileSync( './build/app/config.json', JSON.stringify( objConfig ) );
					return stream;
				}
			)
		);
} );

gulp.task( 'app:lms', ['app:lms:scorm', 'app:lms:xapi'] );

gulp.task( 'app:lms:scorm', ['app:lms:scorm:wrapper', 'app:lms:scorm:definitions'] );

gulp.task( 'app:lms:scorm:wrapper', () => {
	return gulp.src( './src/core/lms/scorm/SCORM_API_wrapper.js' )
		.pipe( gulp.dest( './build/lms/scorm' ) );
} );

gulp.task( 'app:lms:scorm:definitions', () => {
	if( objConfig.lms &&
		objConfig.lms.scorm &&
		objConfig.lms.scorm.enable &&
		objConfig.lms.scorm.version ) {
		gulp.src( './src/core/lms/scorm/definitions/' + objConfig.lms.scorm.version + '/imsmanifest.xml' )
			.pipe(
				xmlpoke(
					{
						replacements: [
							{
								xpath: '//ims:organizations/organization/title',
								namespaces: {
									'ims': 'http://www.imsproject.org/xsd/imscp_rootv1p1p2'
								},
								value: 'TEST'
							}
						]
					}
				)
			)
			/*.pipe(
			 addsrc(
			 [
			 './src/core/lms/scorm/definitions/' + objConfig.lms.scorm.version + '/*',
			 '!./src/core/lms/scorm/definitions/' + objConfig.lms.scorm.version + '/imsmanifest.xml'
			 ]
			 )
			 )*/
			.pipe( gulp.dest( './build' ) );
	}
} );

gulp.task( 'app:lms:xapi', () => {
	//
} );

gulp.task( 'app:data', () => {
	return gulp.src( './src/course/*.json' )
		.pipe( extend( './src/course/' + objConfig.languages.primary + '.json' ) )
		.pipe( gulp.dest( './build/app/course' ) );
} );

gulp.task( 'docs', () => {
	gulp.src( './src/core/js/**/*.js' )
		.pipe( jsdoc( { opts: { destination: './docs/core/' } } ) );
} );

gulp.task( 'archive', () => {
	let now = timestamp();

	gulp.src( './src/course/**/*' )
		.pipe( gulp.dest( './archive/' + now + '/course' ) );
	return gulp.src( './src/app/**/*' )
		.pipe( gulp.dest( './archive/' + now + '/app' ) );
} );

gulp.task( 'new', ['archive'], () => {
	del(
		[
			'./src/course/**/*',
			'./src/app/**/*'
		]
	).then( () => {
		gulp.src( './src/resources/default-course.json' )
			.pipe( rename( 'en.json' ) )
			.pipe( gulp.dest( './src/course' ) );

		gulp.src( './src/resources/default-config.json' )
			.pipe( rename( 'config.json' ) )
			.pipe( gulp.dest( './src/app' ) );
	} );
} );

gulp.task( 'clean', () => {
	return del(
		['./build/**/*']
	);
} );

gulp.task( 'dev', ['build', 'serve'] );

gulp.task( 'serve', () => {
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

	gulp.watch( './src/core/views/index.hbs', ['app:index'] ).on( 'change', browserSync.reload );
	gulp.watch( './src/**/*.hbs', ['app:views'] ).on( 'change', browserSync.reload );
	gulp.watch( './src/core/**/*.js', ['app:js:core'] ).on( 'change', browserSync.reload );
	gulp.watch( './src/activity/**/*.js', ['app:js:activity'] ).on( 'change', browserSync.reload );
	gulp.watch( './src/cards/**/*.js', ['app:js:cards'] ).on( 'change', browserSync.reload );
	gulp.watch( './src/extensions/**/*.js', ['app:js:extensions'] ).on( 'change', browserSync.reload );
	gulp.watch( './src/**/*.scss', ['app:scss'] );
	gulp.watch( './src/course/resources/**/*', ['app:resources'] );
	gulp.watch( './src/app/config.json', ['app:js', 'app:lms'] ).on( 'change', browserSync.reload );
	gulp.watch( './src/course/*.json', ['app:data'] ).on( 'change', browserSync.reload );
} );

gulp.task( 'build', ['app:index', 'app:views', 'app:scss', 'app:resources', 'app:data', 'app:js', 'vendor', 'app:lms'] );

gulp.task( 'package', ['build'], () => {
	return gulp.src( './build/**/*' )
		.pipe( zip( 'scorm-package-' + timestamp() + '.zip' ) )
		.pipe( gulp.dest( './scorm-packages' ) );
} );
