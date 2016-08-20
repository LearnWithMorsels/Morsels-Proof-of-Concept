import { Morsel } from './morsel.model';
import { Config } from './config.model';
import { Course } from './course.model';
import { Languages } from './languages.model';
import { SCORM } from '../lms/scorm.js';
import { xAPI } from '../lms/xapi.js';

export class App extends Morsel {

	constructor( element ) {

		super();

		this.ns = 'App';

		this.element = jQuery( element );
		this.view = 'app.hbs';

		this.config = new Config();

		this.languages = {};

		window.Morsels = {
			app: this,
			eventemitter: this.eventemitter,
			courses: {},
			currentLanguage: null
		};

		this.initialiseLMS();
		this.loadExtensions();
		this.createLanguagesMenu();
		this.loadDefaultLanguage();

		this.render();

		this.addEventListeners();

	}

	loadDefaultLanguage() {

		this.config.defaultLanguage()
			.then( language => {
				this.loadCourse( language );
			} );

	}

	loadCourse( language ) {

		window.Morsels.currentLanguage = language;

		this.getCourse( language )
			.then( course => {
				this.children = [new Course( course, this )];
				this.update();

				return course;
			} );

	}

	getCourse( language ) {

		if( !this.languages[language] ) {
			this.languages[language] = new Promise( ( resolve, reject ) => {
					fetch( './app/course/' + language + '.json' )
						.then( response => response.json() )
						.then( course => {
							window.Morsels.courses[language] = course;
							resolve( course );
						} )
						.catch( e => reject( e ) )
				}
			);
		}

		return this.languages[language];

	}

	createLanguagesMenu() {
		this.config.get( 'languages' )
			.then( languages => {
				if( languages.selector &&
					languages.selector.items &&
					languages.selector.items.length ) {
					new Languages( languages );
				}
			} );
	}

	loadExtensions() {

		this.config.get( 'extensions' )
			.then( extensions => {
				for( let extension in extensions ) {
					if( extensions.hasOwnProperty( extension ) &&
							extensions[extension].enable ) {
						System.import( './js/extensions/' + extension + '/' + window.Morsels.config.properties.extensions[extension].entry ).then( extensionModel => {
							new extensionModel.default( extensions[extension] );
						} );
					}
				}
			} );

	}

	initialiseLMS() {

		this.config.get( 'lms' )
			.then( lms => {
				if( lms ) {
					if( lms.scorm &&
						lms.scorm.enable ) {
						new SCORM( lms.scorm );
					}

					if( lms.xapi &&
						lms.xapi.enable ) {
						new xAPI( lms.xapi );
					}
				}
			} );

	}

	addEventListeners() {

		this.eventemitter.on(
			'languageChanged',
			language => {
				this.getCourse( language )
					.then( course => {
						this.children[0].setProperties( course );
						window.Morsels.currentLanguage = language;
					} );
			},
			this
		).on(
			'postRenderApp',
			app => {
				//console.log( 'App rendered (app)', app );
			},
			this
		).on(
			'postRenderCourse',
			course => {
				console.log( 'Course rendered (app)', course );
			},
			this
		);

	}

}