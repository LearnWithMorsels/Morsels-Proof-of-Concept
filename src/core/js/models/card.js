import {MorselModel} from './morsel';

export class CardModel extends MorselModel {

	constructor( properties ) {
		super();
		this.properties = properties;
		console.log( 'Card ES6 Class!' );
	}

}