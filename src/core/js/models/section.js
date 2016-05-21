import {MorselsModel} from './morsels';
import {CardModel} from './card';

export class SectionModel extends MorselsModel {

	constructor( properties ) {
		super();

		this.template = 'section.hbs';
		this.properties = properties;

		for( var card of properties._cards ) {
			//var objCard = new CardModel( card._card, card );
		}

		super.render()
				.then( html => { this.html = html } )
				.then( () => console.info( 'this.html: ' + this.html ) );
	}
	
}