import {MorselView} from './morsel';

export class SectionView extends MorselView {

	constructor( properties ) {
		super();
		this.properties = properties;
		console.log( 'Section ES6 Class!' );
	}
	
}