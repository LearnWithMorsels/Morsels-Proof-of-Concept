import { Morsel } from './morsel.model';
import { StackTop } from './stacktop.model';
import * as Cards from '../cards';

export class Stack extends Morsel {

	/**
	 * Create a section of the course to insert cards into
	 * @param {Object} properties
	 * @param {Course} parent The parent course model
	 * @returns {Promise}
	 */
	constructor( properties, parent ) {

		super();

		this.properties = properties;
		this.parent = parent;
		this.children = [];
		this.ns = 'Stack';
		this.element = jQuery( '<div class="morsel-stack"/>' );
		this.view = 'stack.hbs';

		let stackTop = new StackTop( properties, this );
		this.children.push( stackTop );
		stackTop.element.css( 'z-index', this.properties._cards.length + 1 );

		for( let card in this.properties._cards ) {
			let strCard = this.properties._cards[card]._card;
			strCard = strCard.charAt( 0 ).toUpperCase() + strCard.slice( 1 );

			let newCard = new ( Cards[strCard] )( this.properties._cards[card], this );
			this.children.push( newCard );
			newCard.element.css( 'z-index', this.properties._cards.length - card );
		}

		this.render();

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
	
	addEventListeners() {

		this.eventemitter.on(
			'postRenderCard',
			( card ) => {
				console.log( 'Card rendered (section)', card );

				if( this.checkAllChildrenRendered() ) {
					this.matchCardHeights();
					this.update();
				}
			},
			this
		).on(
			'postRenderStack',
			( stack ) => {
				//console.log( 'Stack rendered (stack)', stack );
			},
			this
		);
	
	}
	
}