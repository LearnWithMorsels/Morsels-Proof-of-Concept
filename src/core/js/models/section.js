import {MorselsModel} from './morsels';
import {CardModel} from './card';

export class SectionModel extends MorselsModel {

	constructor( properties ) {
		super();

		this.template = 'section.hbs';
		this.properties = properties;

		super.render( this.template, this.properties )
				.then( html => { this.html = html } )
				.then( html => { console.info( html ) } );

		for( var card of properties._cards ) {
			var objCard = new CardModel( card._card, card );
		}
	}
	
}