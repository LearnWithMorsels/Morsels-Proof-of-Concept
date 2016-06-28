import {Card} from './card.model';
import * as Cards from '../cards';

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
		this.view = 'section.hbs';
		this.isRendered = false;

		this.parent.element.append( this.element );

		//console.log( Cards );

		//$( window ).on( 'resize', this.matchCardHeights );

		for( let card in this.properties._cards ) {
			//var newCard = new Card( properties._cards[card], this, card );

			let strCard = this.properties._cards[card]._card;
			strCard = strCard.charAt( 0 ).toUpperCase() + strCard.slice( 1 );
			//console.log( strCard, Cards[strCard] );

			//let newCard = new ( Cards[strCard] )( properties._cards[card], this, card );
			//console.log( Cards );
			//console.log( strCard );
			let newCard = new ( Cards[strCard] )( properties._cards[card], this );
			this.children.push( newCard );
			newCard.element.css( 'z-index', this.properties._cards.length - card );
			newCard.onRender( this.checkAllChildrenRendered );
			newCard.onRender( () => {
				newCard.properties._content.title = 'NEW TITLE';
				//newCard.render();
			} );
		}

		eventemitter.emit( 'sectionAdded', this );

		//super.render();

		return this;

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