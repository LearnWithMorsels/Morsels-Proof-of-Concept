import { Morsel } from './morsel.model';
import { objectrummage } from '../tools/objectrummage';

export class Card extends Morsel {

	/**
	 * Set up a new card
	 * @param {Object} properties
	 * @param {Section} parent
	 * @returns {Promise}
	 */
	constructor( properties, parent ) {

		super();

		this.properties = properties;
		this.parent = parent;
		this.ns = 'Card';
		this.element = jQuery( '<div class="morsel-card"/>' );
		this.promise = new Promise( ( resolve, reject ) => {} );

		this.addEventListeners();

		return this;

	}

	/**
	 * Set up the draggable action of the cards
	 */
	setupDraggable() {

		let dragging = false,
				startPos = {},
				dragPos = {},
				displace = {},
				windowSize = {},
				dismissOnEnd = false,
				mdlCard = this.element.find( '.mdl-card' );

		this.element.on( 'touchstart mousedown', '.mdl-card', e => {
			e = ( e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0] ) || e;
			mdlCard.removeClass( 'mdl-shadow--2dp' ).addClass( 'mdl-shadow--8dp dragging' );
			dragging = true;
			startPos = { x: e.pageX, y: e.pageY };
			windowSize = { w: window.innerWidth, h: window.innerHeight };
		} ).on( 'touchstart mousedown', '.mdl-card button', e => e.stopPropagation() ).on( 'touchmove mousemove', e => {
			if( dragging ) {
				e.preventDefault();
				e = ( e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0] ) || e;
				dragPos = { x: e.pageX, y: e.pageY };
				displace = { x: dragPos.x - startPos.x, y: dragPos.y - startPos.y };
				mdlCard.css( 'transform', 'translate(' + displace.x + 'px, ' + displace.y + 'px)' );
				dismissOnEnd = ( Math.abs( displace.x ) > ( windowSize.w / 4 ) );
			}
		} ).on( 'touchend mouseup', () => {
			dragging = false;
			mdlCard.removeClass( 'mdl-shadow--8dp dragging' ).addClass( 'mdl-shadow--2dp' );
			if( dismissOnEnd ) {
				mdlCard.css( 'transform', 'translate(' + ( displace.x * 4 ) + 'px, ' + ( displace.y * 4 ) + 'px)' );
				this.element.addClass( 'dismissed' );
			} else {
				mdlCard.css( 'transform', 'none' ).blur();
			}
		} );

	}

	addEventListeners() {

		this.element.on( 'click', '.toggle-starred', () => {
			this.isStarred = !this.isStarred;
			this.update();
		} );

		this.eventemitter.on(
			'postRenderCard',
			( card ) => {
				console.log( 'Card rendered (card)', card );
				this.setupDraggable();
				if( this.parent.checkAllChildrenRendered() ) {
					//this.parent.matchCardHeights();
				}
			},
			this
		);

	}

}