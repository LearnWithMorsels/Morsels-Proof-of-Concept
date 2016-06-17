import {Config} from './config.model';
import {Course} from './course.model';

export class App {

	constructor( element ) {

		this.parent = parent;
		this.children = [];
		this.element = jQuery( element );

		let config = new Config();

		return config.defaultLanguage().then( language => { new Course( this, language ) } );

	}

}