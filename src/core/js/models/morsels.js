import {jquery} from 'jquery';
import * as Handlebars from 'handlebars';
import * as crossroads from 'crossroads';

export class MorselsModel {

	constructor() {
		// console.log( '$', $ );
		// console.log( 'Handlebars', Handlebars );
		// console.log( 'crossroads', crossroads );
	}

	config( objNewConfig ) {
		if( objNewConfig ) {
			objConfig = objNewConfig;
		}

		return objConfig;
	}

	render( strTemplateLoc, objData ) {
		return new Promise( ( resolve, reject ) => {
					fetch( 'templates/' + strTemplateLoc )
							.then( response => response.text() )
							.then( template => Handlebars.compile( template ) )
							.then( handlebar => handlebar( objData ) )
							.then( html => resolve( html ) )
							.catch( e => reject( e ) );
				}
		);
	}

}