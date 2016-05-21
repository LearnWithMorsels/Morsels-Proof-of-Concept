import {MorselsModel} from './morsels';

export class CardModel extends MorselsModel {

	constructor( card, properties ) {
		super();

		this.template = 'cards/' + card + '/' + card + '.hbs';
		this.properties = properties;

		super.render( this.template, this.properties )
				/*.then( html => { console.info( html ) } )*/;
	}

}