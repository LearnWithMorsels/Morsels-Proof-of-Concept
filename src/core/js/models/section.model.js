import {Morsel} from './morsel.model';
import * as Cards from '../cards';

export class Section extends Morsel {

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
		this.ns = 'Section';
		this.element = jQuery( '<div class="morsel-section"/>' );
		this.promise = new Promise( ( resolve, reject ) => {} );
		this.view = 'section.hbs';

		for( let card in this.properties._cards ) {
			let strCard = this.properties._cards[card]._card;
			strCard = strCard.charAt( 0 ).toUpperCase() + strCard.slice( 1 );

			let newCard = new ( Cards[strCard] )( properties._cards[card], this );
			this.children.push( newCard );
			newCard.element.css( 'z-index', this.properties._cards.length - card );
		}

		this.render();

		return this;

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
			function( card ) {
				console.log( 'Card rendered (section)', card );

				if( this.checkAllChildrenRendered() ) {
					this.matchCardHeights();
					this.update();
				}
			},
			this
		).on(
			'postRenderSection',
			function( section ) {
				console.log( 'Section rendered (section)', section );
			},
			this
		);
	
	}
	
}