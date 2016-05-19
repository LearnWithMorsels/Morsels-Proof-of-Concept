//import {CONFIG} from '../../app/config.json';

export class ConfigModel {

	constructor( configURI = '../../app/config.json' ) {

		this.promise = new Promise( ( resolve, reject ) => {
				fetch( configURI )
					.then( response => response.json() )
					.then( data => this.properties = data )
					.then( data => resolve( data ) )
					//.then( () => { console.info( this.properties ) } )
					.catch( e => reject( e ) )
			}
		);

		this.promise
			.then(
				( data ) => { /*console.info( 'Got the data!', data )*/ },
				( e ) => { console.error( ':(', e ) }
			);
		
		return this;

	}

	get( strKey = null ) {

		return ( strKey === null ) ? this.properties : ( this.properties[strKey] || null );
		
	}

}