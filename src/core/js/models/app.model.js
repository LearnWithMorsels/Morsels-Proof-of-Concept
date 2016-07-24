import { Morsel } from './morsel.model';
import { Config } from './config.model';
import { Course } from './course.model';

export class App extends Morsel {

	constructor( element ) {

		super();

		this.parent = parent;
		this.children = [];

		this.ns = 'App';

		this.element = jQuery( element );
		this.view = 'app.hbs';
		
		this.languages = [];

		this.config = new Config();

		this.config.defaultLanguage()
			.then( language => {
				this.loadLanguageCourse( language )
					.then( course => {
						this.children = [new Course( course, this )];
						this.update();

						return course;
					} );
			} );

		this.render();

		this.addEventListeners();

	}

	loadLanguageCourse( language ) {

		if( !this.languages[language] ) {
			this.languages[language] = new Promise( ( resolve, reject ) => {
					fetch( 'app/course/' + language + '.json' )
						.then( response => resolve( response.json() ) )
						.catch( e => reject( e ) )
				}
			);
		}

		return this.languages[language];

	}

	addEventListeners() {

		this.eventemitter.on(
			'languageChanged',
			language => {
				this.loadLanguageCourse( language )
					.then( course => {
						this.children[0].setProperties( course );
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