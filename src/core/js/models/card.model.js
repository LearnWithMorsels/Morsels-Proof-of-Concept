import {Morsel} from './morsel.model';
import {objectrummage} from '../tools/objectrummage';

export class Card extends Morsel {

	/**
	 * Set up a new card
	 * @param {Object} properties
	 * @param {Section} parent
	 * @param {number} index
	 * @returns {Promise}
	 */
	constructor() {

		super();

		this.isRendered = false;
		this.promise = new Promise( ( resolve, reject ) => {} );

		return this;

	}

	render() {

		this.promise = super.render()
			.then( () => this.isRendered = true )
			.then( () => this.parent.element.append( this.element ) )
			.then( () => this.setupDraggable() );

	}

	onRender( funDo ) {

		this.promise
			.then( () => funDo.call( this.parent ) );

	}

	update( property, value ) {

		this.properties = objectrummage( property, this.properties, value );

		super.render()
				.then( html => this.element.html( html ) );

	}

	/**
	 * Set up the draggable action of the cards
	 */
	setupDraggable() {

		if( this.element.next().length > 0 ) {
			let dragging = false,
					startPos = {},
					dragPos = {},
					displace = {},
					windowSize = {},
					flipped = false,
					dismissOnEnd = false,
					rotation = 0,
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
					// if( flipped ) {
					// 	if( displace.x > 0 ) {
					// 		rotation = ( ( displace.x / mdlCard.width() ) * 180 ) - 180;
					// 		mdlCard.css( 'transform', 'rotateY(' + rotation + 'deg)' );
					// 	}
					// } else {
						//if( displace.x > 0 ) {
							//rotation = -( ( displace.x / ( windowSize.w / 2 ) ) * ( displace.y / ( windowSize.h / 2 ) ) ) * 15; // Rotate on dismiss
							mdlCard.css( 'transform', 'translate(' + displace.x + 'px, ' + displace.y + 'px)' );
							dismissOnEnd = ( Math.abs( displace.x ) > ( windowSize.w / 4 ) );
						// } else {
						// 	flipped = true;
						// 	rotation = ( displace.x / mdlCard.width() ) * 180;
						// 	mdlCard.css( 'transform', 'rotateY(' + rotation + 'deg)' );
						// }
					//}
				}
			} ).on( 'touchend mouseup', () => {
				dragging = false;
				mdlCard.removeClass( 'mdl-shadow--8dp dragging' ).addClass( 'mdl-shadow--2dp' );
				// if( flipped ) {
				// 	if( rotation >= 90 ) {
				// 		console.log( 'A' );
				// 		mdlCard.css( 'transform', 'none' );
				// 	} else {
				// 		console.log( 'B' );
				// 		mdlCard.css( 'transform', 'rotateY(-180deg)' );
				// 	}
				// } else {
					/*if( rotation <= -90 ) {
						console.log( 'C' );
						mdlCard.css( 'transform', 'rotateY(-180deg)' );
					} else */if( dismissOnEnd ) {
						// console.log( 'D' );
						mdlCard.css( 'transform', 'translate(' + ( displace.x * 4 ) + 'px, ' + ( displace.y * 4 ) + 'px)' );
						//this.element.height( this.element.height() );
						this.element.addClass( 'dismissed' );
					// setTimeout(
					// 		() => {
					// 			this.element.height( 0 );
					// 		}, 1
					// );
					} else {
						// console.log( 'E' );
						mdlCard.css( 'transform', 'none' ).blur();
					}
				//}
			} );
		}

	}

}