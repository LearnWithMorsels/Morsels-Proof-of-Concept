import {MorselsModel} from './morsels';
import {Config} from './config';
import {Course} from './course';
//import {Binding, update} from 'handlebarsbinding';
import * as HandlebarsBinding from 'handlebarsbinding';

export class App extends MorselsModel {

	constructor( element ) {

		super();

		this.template = 'theme/course.hbs';
		this.parent = parent;
		this.children = [];
		this.element = jQuery( element );
		this.isRendered = false;

		let config = new Config();

		//Binding( Handlebars );

		console.log( HandlebarsBinding );

		return super.render()
				.then( html => this.element.replaceWith( html ) )
				.then( () => this.isRendered = true )
				.then( () => { config.defaultLanguage().then( language => { new Course( this, '#course-content', language ) } ) } );

	}

}