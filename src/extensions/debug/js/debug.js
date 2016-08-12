import { Extension } from '../../models/extension.model';

export default class extends Extension {

	constructor( config ) {

		super();

		this.config = config;

		this.showDebugHeader();

	}

	showDebugHeader() {

		try {
			var args = [
				'%c %c %c LearnWithMorsels/Morsels %c %c ',
				'font-size: 14px; background: #0AFFE7',
				'font-size: 16px; background: #00CCB8',
				'color: #FFF; font-size: 18px; background: #009688;',
				'font-size: 16px; background: #00CCB8',
				'font-size: 14px; background: #0AFFE7'
			];

			console.log.apply( console, args );
		} catch( e ) {
			if( window.console ) {
				if( window.console.info ) {
					console.info( 'LearnWithMorsels/Morsels' );
				} else {
					console.log( 'LearnWithMorsels/Morsels' );
				}
			}
		}

	}
}