//import * as $ from 'jquery';
import {MorselsModel} from './morsels';
import {Card} from './card';

export class Section extends MorselsModel {

	/**
	 * Create a section of the course to insert cards into
	 * @param {Object} properties
	 * @param {Course} parent The parent course model
	 */
	constructor( properties, parent ) {
		super();

		this.template = 'section.hbs';
		this.properties = properties;
		this.parent = parent;
		this.children = [];
		this.element = $( '<div class="morsel-section"/>' );

		this.parent.element.append( this.element );

		super.render()
				.then( html => this.element.html( html ) )
				//.then( () => this.parent.element.append( this.element ) )
				.then( () => {
					for( var card in properties._cards ) {
						this.children.push( new Card( properties._cards[card], this, card ) );
					}
				} );


	}
	
}