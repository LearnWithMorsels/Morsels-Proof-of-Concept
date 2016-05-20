import {SectionModel} from './section';

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
	var promise = new Promise( ( resolve, reject ) => {
				fetch( 'app/course/' + strLanguage + '.json' )
						.then( response => response.json() )
						.then( data => resolve( data ) )
						.catch( e => reject( e ) )
			}
	);

	promise.then(
			( course ) => {
				//console.log( 'Theme: ' + objConfig.get( 'theme' ) );
				//console.log( 'Course:', course );
				for( var section of course._sections ) {
					//console.log( 'Section: ' + section.title, section );

					var objSection = new SectionModel( section );
				}
			}
	).then(
			( data ) => {
				console.info( 'Got the data!', data );
			},
			( e ) => { console.error( ':(', e ) }
	);

	return promise;

}