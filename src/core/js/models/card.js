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
				startPos = {};

		this.element.on( 'touchstart mousedown', '.mdl-card', e => {
			var touch = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
			e = touch || e;
			this.element.find( '.mdl-card' ).removeClass( 'mdl-shadow--2dp' ).addClass( 'mdl-shadow--8dp dragging' );
			dragging = true;
			startPos = { x: e.pageX, y: e.pageY };
			console.log( 'A', startPos );
		} ).on( 'touchmove mousemove', e => {
			if( dragging ) {
				e.preventDefault();
				var touch = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
				e = touch || e;
				this.element.find( '.mdl-card' ).css( 'transform', 'translate(' + ( e.pageX - startPos.x ) + 'px, ' + ( e.pageY - startPos.y ) + 'px)' );
			}
		} ).on( 'touchend mouseup', () => {
			this.element.find( '.mdl-card' ).removeClass( 'mdl-shadow--8dp dragging' ).addClass( 'mdl-shadow--2dp' );
			dragging = false;
			this.element.find( '.mdl-card' ).css( 'transform', 'none' );
		} );

	}

}