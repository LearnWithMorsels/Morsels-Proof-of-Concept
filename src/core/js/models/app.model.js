import { Morsel } from './morsel.model';
import { Config } from './config.model';
import { Course } from './course.model';

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
			courses: {},
			currentLanguage: null
		};

		this.config.get()
			.then( config => {
				window.Morsels.config = config
			} );

		this.config.defaultLanguage()
			.then( language => {
				window.Morsels.currentLanguage = language;

				this.getCourse( language )
					.then( course => {
						this.children = [new Course( course, this )];
						this.update();

						return course;
					} );
			} );

		this.loadExtensions();

		this.render();

		this.addEventListeners();

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

	loadExtensions() {

		this.config.get( 'extensions' )
			.then( extensions => {
				for( let extension in extensions ) {
					if( extensions.hasOwnProperty( extension ) &&
							extensions[extension].enable ) {
						//console.log( extensions[extension] );
						//console.log( window.Morsels.config.properties.extensions[extension] );

						System.import( './js/extensions/' + extension + '/' + window.Morsels.config.properties.extensions[extension].entry ).then( extension => {
							new extension.default( extensions[extension] );
						} );
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

		$( '#language-selector-options' ).on(
			'click',
			'[data-language]',
			e => {
				this.eventemitter.emit( 'languageChanged', $( e.target ).attr( 'data-language' ) );
			}
		);

	}

}