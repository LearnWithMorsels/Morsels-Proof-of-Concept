import {jquery} from 'jquery';
import * as Handlebars from 'handlebars';

export class MorselsModel {

	constructor() {
		//console.log( '$', $ );
		//console.log( 'Handlebars', Handlebars );
		//console.log( 'crossroads', crossroads );

		this.isComplete = false;
		this.element = 'CORE';
		this.template = 'CORE';
		this.properties = {};
	}

	render() {
		return new Promise( ( resolve, reject ) => {
					fetch( 'templates/' + this.template )
							.then( response => response.text() )
							.then( template => Handlebars.compile( template ) )
							.then( handlebar => { return handlebar( this.properties ) } )
							.then( html => resolve( html ),
									e => { console.error( 'Failed to render "' + this.template + '": ', e.message ) } )
							.catch( e => reject( e ) );
				}
		);
	}

}