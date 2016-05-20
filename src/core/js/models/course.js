/**
 * Retrieve the course details
 * @param strLanguage {string} The language code of the file
 * @returns {Promise} The promise
 * @constructor
 */
export function Course( strLanguage ) {

	/**
	 * The promise for retrieving the JSON file
	 * @type {Promise}
	 */
    this.promise = new Promise( ( resolve, reject ) => {
            fetch( 'app/course/' + strLanguage + '.json' )
                .then( response => response.json() )
                .then( data => resolve( data ) )
                .catch( e => reject( e ) )
        }
    );

	this.promise.then(
        ( data ) => { /*console.info( 'Got the data!', data )*/ },
        ( e ) => { console.error( ':(', e ) }
    );

    return this.promise;

}