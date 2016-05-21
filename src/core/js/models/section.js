import {MorselsModel} from './morsels';
import {CardModel} from './card';
import {elementcreator} from '../tools/elementcreator';

export class SectionModel extends MorselsModel {

	constructor( properties, parent ) {
		super();

		this.template = 'section.hbs';
		this.properties = properties;
		this.parent = parent;
		//this.element = elementcreator( 'morsel-section' );
		this.element = $( '<div class="morsel-section"/>' );

		super.render()
				.then( html => this.element.html( html ) )
				.then( () => this.parent.element.append( this.element ) )
				.then( () => {
					for( var card of properties._cards ) {
						new CardModel( card, this );
					}
				} );


	}
	
}