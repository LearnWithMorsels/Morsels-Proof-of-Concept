import {Card} from './card';

let allChildrenRendered = false;

export class Section {

	/**
	 * Create a section of the course to insert cards into
	 * @param {Object} properties
	 * @param {Course} parent The parent course model
	 * @returns {Promise}
	 */
	constructor( properties, parent ) {

		this.properties = properties;
		this.parent = parent;
		this.children = [];
		this.element = jQuery( '<div class="morsel-section"/>' );
		this.isRendered = false;

		this.parent.element.append( this.element );

		//$( window ).on( 'resize', this.matchCardHeights );

		for( let card in properties._cards ) {
			var newCard = new Card( properties._cards[card], this, card );
			this.children.push( newCard );
			newCard.onRender( this.checkAllChildrenRendered );
		}

		window.cards = this.children;

	}

	checkAllChildrenRendered() {

		if( !allChildrenRendered ) {
			let allRendered = true;
			
			for( let card of this.children ) {
				if( !card.isRendered ) {
					allRendered = false;
					break;
				}
			}

			if( allRendered ) {
				allChildrenRendered = true;
				this.matchCardHeights();
			}
		}

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