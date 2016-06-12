import {MorselsModel} from './morsels';
import {Card} from './card';

let allChildrenRendered = false;

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
		this.element = jQuery( '<div class="morsel-section"/>' );
		this.isRendered = false;

		this.parent.element.append( this.element );

		return super.render()
				.then( html => this.element.html( html ) )
				.then( () => this.isRendered = true )
				.then( () => {
					for( let card in properties._cards ) {
						var newCard = new Card( properties._cards[card], this, card );
						this.children.push( newCard );
						newCard.onRender( this.checkAllChildrenRendered );
					}
				} );

	}

	checkAllChildrenRendered() {
		if( !allChildrenRendered ) {
			let allRendered = true,
					intTallestCard = 0;
			
			for( let card of this.parent.children ) {
				if( !card.isRendered ) {
					allRendered = false;
					break;
				}
			}

			if( allRendered ) {
				allChildrenRendered = true;

				for( let card of this.parent.children ) {
					let mdlCard = card.element.find( '.mdl-card' ),
							mdlCardHeight = mdlCard.height();
					if( mdlCardHeight > intTallestCard ) {
						intTallestCard = mdlCardHeight;
					}
				}

				for( let card of this.parent.children ) {
					let mdlCard = card.element.find( '.mdl-card' );
					mdlCard.height( intTallestCard );
				}
			}
		}
	}
	
}