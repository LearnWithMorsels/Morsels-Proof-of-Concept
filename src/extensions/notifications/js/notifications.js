import { Extension } from '../../models/extension.model';

export default class extends Extension {

	constructor( config ) {

		super();

		this.config = config;

		if( 'Notification' in window ) {
			if( window.Notification.permission === 'granted' ) {
				this.addEventListeners();
			} else if( window.Notification.permission !== 'denied' ) {
				window.Notification.requestPermission( permission => {
					if( permission === 'granted' ) {
						new window.Notification( 'Thanks!' );
						this.addEventListeners();
					}
				} );
			}
		}

	}

	addEventListeners() {

		window.Morsels.eventemitter.on(
			'notify',
			notification => {
				console.info( 'NOTIFICATION', notification );
				var temp = new window.Notification( notification.title || 'Hi there!', { body: 'Lorem ipsum' } );
				console.log( temp );
			}
		);

	}

}