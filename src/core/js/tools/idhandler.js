if( !window.idhandlers ) {
	window.idhandlers = [];
}

export class idhandler {

	static get() {

		let newKey;

		do {
			newKey = this.generate();
			//console.log( 'Try ' + newKey );
		} while( this.exists( newKey ) );

		this.register( newKey );

		return newKey;

	}

	static generate() {

		let date = ( new Date );

		return Math.round( ( date.getTime() + date.getMilliseconds() ) * ( Math.random() * 1000000 ) ).toString();

	}

	static register( key ) {

		return window.idhandlers.push( key );

	}

	static exists( key ) {

		return window.idhandlers.indexOf( key ) !== -1;

	}

}