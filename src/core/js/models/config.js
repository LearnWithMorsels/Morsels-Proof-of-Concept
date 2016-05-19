//import {CONFIG} from '../../app/config.json';

export class ConfigModel {

	constructor( configURI = '../../app/config.json' ) {

		this.proConfig = new Promise( ( resolve, reject ) => {
				fetch( configURI )
					.then( response => response.json() )
					//.then( data => this.properties = data )
					.then( data => resolve( data ) )
					//.then( () => { console.info( this.properties ) } )
					.catch( e => reject( e ) )
			}
		);

	}

	data() {

		this.proConfig
			.then(
				( data ) => {
					console.info( 'Got the data!', data );
					return data;
				},
				( e ) => { console.error( ':(', e ) }
			);

	}

}