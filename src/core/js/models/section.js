import {MorselModel} from './morsel';

export class SectionModel extends MorselModel {

	constructor( properties ) {
		super();
		this.properties = properties;
		console.log( 'Section ES6 Class!' );
	}
	
}