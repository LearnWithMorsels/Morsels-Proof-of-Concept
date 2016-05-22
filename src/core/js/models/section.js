//import * as $ from 'jquery';
import {MorselsModel} from './morsels';
import {Card} from './card';

export class Section extends MorselsModel {

	/**
	 * Create a section of the course to insert cards into
	 * @param {Object} properties
	 * @param {Course} parent The parent course model
	 * @returns {Promise}
	 */
	constructor( properties, parent ) {
		super();

		this.template = 'section.hbs';
		this.properties = properties;
		this.parent = parent;
		this.children = [];
		this.element = $( '<div class="morsel-section"/>' );
		this.isRendered = false;

		this.parent.element.append( this.element );

		return super.render()
				.then( html => this.element.html( html ) )
				.then( () => this.isRendered = true )
				.then( () => {
					for( let card in properties._cards ) {
						var newCard = new Card( properties._cards[card], this, card );
						this.children.push( newCard );
						newCard.then( () => this.checkAllChildrenRendered );
					}
				} );

	}

	checkAllChildrenRendered() {
		console.log( 'abc' );
		let allRendered = true,
				intTallestCard = 0;

		for( let card of this.children ) {
			if( !card.isRendered ) {
				allRendered = false;
				break;
			}
		}

		console.log( allRendered );

		if( allRendered ) {
			for( let card of this.children ) {
				if( card.element.height() > intTallestCard ) {
					intTallestCard = card.element.height();
				}
			}

			for( let card of this.children ) {
				card.element.height( intTallestCard );
			}
		}
	}
	
}