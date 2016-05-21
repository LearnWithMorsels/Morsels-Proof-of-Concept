import {MorselsModel} from './morsels';
import {CardModel} from './card';
import {elementcreator} from '../tools/elementcreator';

export class SectionModel extends MorselsModel {

	constructor( properties, parent ) {
		super();

		this.template = 'section.hbs';
		this.properties = properties;
		this.parent = parent;
		this.element = elementcreator( 'morsel-section' );

		super.render()
				.then( html => this.element.innerHTML = html )
				.then( () => this.parent.element.appendChild( this.element ) )
				.then( () => {
					for( var card of properties._cards ) {
						new CardModel( card, this );
					}
				} );


	}
	
}