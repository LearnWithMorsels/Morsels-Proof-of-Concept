import {MorselsModel} from './morsels';
import {Section} from './section';

export class Course extends MorselsModel {

	/**
	 * Retrieve the course details
	 * @param strLanguage {string} The language code of the file
	 * @returns {Promise} The promise
	 * @constructor
	 */
	constructor( strLanguage ) {

		super();

		this.element = jQuery( '#morsel-course' );
		this.children = [];

		/**
		 * The promise for retrieving the JSON file
		 * @type {Promise}
		 */
		this.promise = new Promise( ( resolve, reject ) => {
					fetch( 'app/course/' + strLanguage + '.json' )
							.then( response => response.json() )
							.then( course => {
								this.element.html( '' );

								for( let section of course._sections ) {
									this.children.push( new Section( section, this ) );
								}

								return course;
							} )
							//.then( course => super.render() )
							.then( course => resolve( course ) )
							.catch( e => reject( e ) )
				}
		);

		return this.promise;

	}

}