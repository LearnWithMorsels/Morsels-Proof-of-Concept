import {MorselView} from './morsel';

export class CardView extends MorselView {

	constructor( properties ) {
		super();
		this.properties = properties;
		console.log( 'Card ES6 Class!' );
	}

}