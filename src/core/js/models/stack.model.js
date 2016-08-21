import { Morsel } from './morsel.model';
import * as Cards from '../cards';

export class Stack extends Morsel {

	/**
	 * Create a section of the course to insert cards into
	 * @param {Object} properties
	 * @param {Course} parent The parent course model
	 */
	constructor( properties, parent ) {

		super();

		this.parent = parent;
		this.children = [];
		this.childProperty = '_cards';

		this.properties = properties;

		this.ns = 'Stack';

		this.element = jQuery( '<div class="morsel-stack"/>' );
		this.view = 'stack.hbs';

		this.render();

		for( let card in this.properties[this.childProperty] ) {
			let strCard = this.properties[this.childProperty][card]._card;
			strCard = strCard.charAt( 0 ).toUpperCase() + strCard.slice( 1 );

			let newCard = new ( Cards[strCard] )( this.properties[this.childProperty][card], this );
			this.children.push( newCard );
			newCard.element.css( 'z-index', this.properties[this.childProperty].length - card );
		}

		this.addEventListeners();

	}

	matchCardHeights() {

		let intTallestCard = 0;

		for( let card of this.children ) {
			let mdlCard = card.element.find( '.mdl-card' );
			mdlCard.height( 'auto' );
			let mdlCardHeight = mdlCard.height();

			if( mdlCardHeight > intTallestCard ) {
				intTallestCard = mdlCardHeight;
			}
		}

		for( let card of this.children ) {
			let mdlCard = card.element.find( '.mdl-card' );
			mdlCard.height( intTallestCard );
		}

	}
	
}