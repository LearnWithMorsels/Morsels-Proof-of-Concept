import { Morsel } from './morsel.model';
import { Config } from './config.model';
import { Course } from './course.model';
//import EventEmitter from '../vendor/eventemitter3';

export class App extends Morsel {

	constructor( element ) {

		super();

		this.parent = parent;
		this.children = [];
		this.ns = 'App';
		this.element = jQuery( element );
		this.view = 'app.hbs';

		this.config = new Config();

		//let EE = new EventEmitter();
		//window.eventemitter = EE;
		//window.eventemitter = new EventEmitter();

		//config.defaultLanguage()
		//	.then( language => {
		//		this.children = [new Course( this, language )]
		//	} )
		//	.then( () => this.update );

		//this.render();

		this.eventemitter.emit( 'languageChanged' );

		this.postRender( () => {
			//console.log( 'postRender app' );
		} );

	}

	addEventListeners() {

		this.eventemitter.on(
			'languageChanged',
			function( language ) {
				//console.log( 'Change language to ' + language );

				this.config.defaultLanguage()
					.then( language => {
						this.children = [new Course( this, language )];
						this.render();
					} );
			},
			this
		).on(
			'postRenderApp',
			function( app ) {
				console.log( 'App rendered (app)', app );
			},
			this
		).on(
			'postRenderCourse',
			function( course ) {
				console.log( 'Course rendered (app)', course );
			},
			this
		);

		$( '#language-selector-options' ).on(
			'click',
			'[data-language]',
			( e ) => {
				this.load( $( e.target ).attr( 'data-language' ) );
			}
		);

	}

	load( language ) {

		//this.course = new Course( this, language );

	}

}