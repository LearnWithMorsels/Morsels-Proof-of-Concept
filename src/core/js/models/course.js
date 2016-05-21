import {SectionModel} from './section';

export class Course {

	/**
	 * Retrieve the course details
	 * @param strLanguage {string} The language code of the file
	 * @returns {Promise} The promise
	 * @constructor
	 */
	constructor( strLanguage ) {

		this.element = 'Course';

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
					for( var section of course._sections ) {
						console.log( 'Section: ' + section.title, section );

						var objSection = new SectionModel( section );
					}
				}
		).then( null, ( e ) => { console.error( ':(', e ) } );

		return promise;

	}

}