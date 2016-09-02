import { Morsel } from './morsel.model';
import * as Activities from '../activities';

export class Card extends Morsel {

	constructor( properties, parent ) {

		super();

		this.parent = parent;
		this.childProperty = '_activities';

		this.properties = properties;

		this.ns = 'Card';

		this.element = jQuery( '<div class="morsel-card"/>' );

		this.addEventListeners();
		this.addActivities();

	}

	addActivities() {

		if( this.properties._activities &&
				this.properties._activities._items &&
				this.properties._activities._items.length ) {
			for( let activity of this.properties._activities._items ) {
				let strActivity = activity._type;
				strActivity = strActivity.charAt( 0 ).toUpperCase() + strActivity.slice( 1 );

				let newActivity = new ( Activities[strActivity] )( activity, this );
				this.children.push( newActivity );
			}
		}

	}

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
				this.isComplete = true;
				this.eventemitter.emit( 'completeCard', this );
			} else {
				mdlCard.css( 'transform', 'none' ).blur();
			}
		} );

	}

	addEventTriggers() {

		this.element.on( 'click', '.toggle-starred', () => {
			this.isStarred = !this.isStarred;
			this.update();
		} ).on( 'click', '.launch-activity', () => {
			this.isActivity = true;
			this.update();
		} );

	}

	addEventListeners() {

		this.eventemitter.on(
			'postRenderCard',
			card => {
				card.setupDraggable();

				if( card.parent.checkAllChildrenRendered() ) {
					card.parent.matchCardHeights();
				}
			}
		).on(
			'completeCard',
			card => {
				if( card === this ) {
					console.log( 'Card complete' );
					if( card.parent.checkAllChildrenComplete() ) {
						console.log( 'Stack complete' );
						card.parent.isComplete = true;
						card.parent.update();
						window.Morsels.eventemitter.emit( 'notify', { title: 'CUSTOM' }, this );
					}
				}
			}
		);

	}

}