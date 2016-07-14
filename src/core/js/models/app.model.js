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

		this.config = new Config();

		this.config.defaultLanguage()
			.then( language => {
				this.children = [new Course( this, language )];
				this.render();
			} );

	}

	addEventListeners() {

		this.eventemitter.on(
			'languageChanged',
			( language ) => {
				console.log( 'Change language to ' + language );

				this.children = [new Course( this, language )];
				this.update();
			},
			this
		).on(
			'postRenderApp',
			( app ) => {
				console.log( 'App rendered (app)', app );
			},
			this
		).on(
			'postRenderCourse',
			( course ) => {
				console.log( 'Course rendered (app)', course );
			},
			this
		);

		$( '#language-selector-options' ).on(
			'click',
			'[data-language]',
			( e ) => {
				this.eventemitter.emit( 'languageChanged', $( e.target ).attr( 'data-language' ) );
			}
		);

	}

}