import {MorselsModel} from './morsels';
import {elementcreator} from '../tools/elementcreator';

export class CardModel extends MorselsModel {

	constructor( properties, parent ) {

		super();

		this.template = 'cards/' + properties._card + '/' + properties._card + '.hbs';
		this.properties = properties;
		this.parent = parent;
		//this.element = elementcreator( 'morsel-card' );
		this.element = $( '<div class="morsel-card"/>' );

		super.render()
				.then( html => this.element.html( html ) )
				.then( () => this.parent.element.append( this.element ) )
				.then( () => this.setupDraggable() );

	}

	setupDraggable() {

		var dragging = false,
				startPos = {},
				dragPos = {},
				windowSize = {};

		this.element.on( 'touchstart mousedown', '.mdl-card', e => {
			e = ( e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0] ) || e;
			this.element.find( '.mdl-card' ).removeClass( 'mdl-shadow--2dp' ).addClass( 'mdl-shadow--8dp dragging' );
			dragging = true;
			startPos = { x: e.pageX, y: e.pageY };
			windowSize = { w: window.innerWidth, h: window.innerHeight };
		} ).on( 'touchmove mousemove', e => {
			if( dragging ) {
				e.preventDefault();
				e = ( e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0] ) || e;
				dragPos = { x: e.pageX, y: e.pageY };
				var displace = { x: dragPos.x - startPos.x, y: dragPos.y - startPos.y },
						rotation = -( ( displace.x / ( windowSize.w / 2 ) ) * ( displace.y / ( windowSize.w / 2 ) ) ) * 15;
				this.element.find( '.mdl-card' ).css( 'transform', 'translate(' + displace.x + 'px, ' + displace.y + 'px) rotate(' + rotation + 'deg)' );
			}
		} ).on( 'touchend mouseup', () => {
			this.element.find( '.mdl-card' ).removeClass( 'mdl-shadow--8dp dragging' ).addClass( 'mdl-shadow--2dp' ).css( 'transform', 'none' );
			dragging = false;
		} );

	}

}