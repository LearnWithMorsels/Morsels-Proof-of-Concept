
export class ConfigModel {

	/**
	 * Create a new config object and retrieve the JSON file
	 * @param {string} [configURI='app/config.json'] The location of the JSON file
	 * @constructor
	 * @returns {ConfigModel}
	 */
	constructor( configURI = 'app/config.json' ) {

		/**
		 * The promise to retrieve the JSON file
		 * @type {Promise}
		 */
		this.promise = new Promise( ( resolve, reject ) => {
				fetch( configURI )
					.then( response => response.json() )
					.then( data => this.properties = data )
					.then( data => resolve( data ) )
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

	/**
	 * Get a value from the config JSON
	 * @param {string} strKey The property to retrieve
	 * @returns {*}
	 */
	get( strKey = null ) {

		return ( strKey === null ) ? this.properties : ( this.properties[strKey] || null );
		
	}

}