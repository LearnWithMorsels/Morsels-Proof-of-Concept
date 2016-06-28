import {Config} from './config.model';
import {Course} from './course.model';
import EventEmitter from '../vendor/eventemitter3';

export class App {

	constructor( element ) {

		this.parent = parent;
		this.children = [];
		this.element = jQuery( element );

		let config = new Config();

		let EE = new EventEmitter();
		window.eventemitter = EE;

		this.addEventListeners();

		config.defaultLanguage().then( language => { this.course = new Course( this, language ) } );

	}

	addEventListeners() {

		eventemitter.on(
			'appReady',
			function( alpha, beta ) {
				//console.log( 'App ready', this, alpha, beta );
			},
			this
		).on(
			'languageChanged',
			function( language ) {
				//console.log( 'Change language to ' + language );
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