import { objectrummage } from '../tools/objectrummage';

export class Config {

	/**
	 * Create a new config object and retrieve the JSON file
	 * @param {string} [configURI='app/config.json'] The location of the JSON file
	 * @constructor
	 * @returns {Config} The config instance
	 */
	constructor( configURI = './app/config.json' ) {

		/**
		 * The promise to retrieve the JSON file
		 * @type {Promise}
		 */
		this.promise = new Promise( ( resolve, reject ) => {
				fetch( configURI )
					.then( response => response.json() )
					.then( config => {
						window.Morsels.config = config;
						return config;
					} )
					.then( config => resolve( config ) )
					.catch( e => reject( e ) )
			}
		);

		return this;

	}

	/**
	 * Function to perform after the config has loaded
	 * @param {function} doThis Function to execute once loaded
	 * @returns {Config} The config instance
	 */
	onLoad( doThis ) {

		this.promise
				.then( data => doThis,
						e => console.error( 'Failed to perform onLoad function: ' + e.message ) );

		return this;

	}

	/**
	 * Get the default language to render
	 * @returns {Promise} A promise containing the default language
	 */
	defaultLanguage() {

		return this.get( 'languages' )
				.then( languages => {
					if( languages.selector &&
							languages.selector.default ) {
						return languages.selector.default;
					} else if( languages.primary ) {
						return languages.primary;
					} else {
						reject( e );
						return null;
					}
				} );

	}

	/**
	 * Get a value from the config JSON
	 * @param {string} strKey The property to retrieve
	 * @returns {Promise} The value requested
	 */
	get( strKey = null ) {

		return this.promise
				.then( data => {
							if( strKey === null ) {
								return data;
							} else {
								return objectrummage( strKey, data );
							}
						},
						e => { console.error( 'Couldn\'t get property "' + strKey + '": ', e.message ) }
				);

	}

}