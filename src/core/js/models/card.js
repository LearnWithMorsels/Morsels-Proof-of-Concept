//import * as $ from 'jquery';
import {MorselsModel} from './morsels';

export class Card extends MorselsModel {

	/**
	 * Set up a new card
	 * @param {Object} properties
	 * @param {Section} parent
	 * @param {number} index
	 */
	constructor( properties, parent, index ) {

		super();

		this.template = 'cards/' + properties._card + '/' + properties._card + '.hbs';
		this.properties = properties;
		this.parent = parent;
		this.children = [];
		this.element = $( '<div class="morsel-card"/>' ).css( 'z-index', 100 - index );
		//this.element = $( '<div class="morsel-card"/>' );

		this.parent.element.append( this.element );

		super.render()
				.then( html => this.element.html( html ) )
				//.then( () => this.parent.element.append( this.element ) )
				.then( () => this.setupDraggable() );

	}

	/**
	 * Set up the draggable action of the cards
	 */
	setupDraggable() {

		var dragging = false,
				startPos = {},
				dragPos = {},
				displace = {},
				windowSize = {},
				dismissOnEnd = false,
				rotation = 0,
				mdlCard = this.element.find( '.mdl-card' );

		this.element.on( 'touchstart mousedown', '.mdl-card', e => {
			e = ( e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0] ) || e;
			mdlCard.removeClass( 'mdl-shadow--2dp' ).addClass( 'mdl-shadow--8dp dragging' );
			dragging = true;
			startPos = { x: e.pageX, y: e.pageY };
			windowSize = { w: window.innerWidth, h: window.innerHeight };
		} ).on( 'touchmove mousemove', e => {
			if( dragging ) {
				e.preventDefault();
				e = ( e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0] ) || e;
				dragPos = { x: e.pageX, y: e.pageY };
				displace = { x: dragPos.x - startPos.x, y: dragPos.y - startPos.y };
				rotation = -( ( displace.x / ( windowSize.w / 2 ) ) * ( displace.y / ( windowSize.h / 2 ) ) ) * 15;
				mdlCard.css( 'transform', 'translate(' + displace.x + 'px, ' + displace.y + 'px) rotate(' + rotation + 'deg)' );
				dismissOnEnd = ( displace.x > ( windowSize.w / 2 ) ); // Only when displacing/swiping right
			}
		} ).on( 'touchend mouseup', () => {
			mdlCard.removeClass( 'mdl-shadow--8dp dragging' ).addClass( 'mdl-shadow--2dp' );
			if( dismissOnEnd ) {
				mdlCard.css( 'transform', 'translate(' + ( displace.x * 3 ) + 'px, ' + ( displace.y * 3 ) + 'px) rotate(' + rotation + 'deg)' );
			} else {
				mdlCard.css( 'transform', 'none' );
			}
			dragging = false;
		} );

	}

}