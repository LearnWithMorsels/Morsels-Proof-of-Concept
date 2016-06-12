import {Section} from './section';

export class Course {

	/**
	 * Retrieve the course details
	 * @param strLanguage {string} The language code of the file
	 * @returns {Promise} The promise
	 * @constructor
	 */
	constructor( parent, element, language ) {

		this.element = jQuery( element );
		this.children = [];
		this.parent = parent;
		this.properites = {};

		/**
		 * The promise for retrieving the JSON file
		 * @type {Promise}
		 */
		this.promise = new Promise( ( resolve, reject ) => {
					fetch( 'app/course/' + language + '.json' )
							.then( response => response.json() )
							.then( course => this.properites = course )
							.then( course => {
								this.element.html( '' );

								for( let section of course._sections ) {
									this.children.push( new Section( section, this ) );
								}

								return course;
							} )
							.then( course => resolve( course ) )
							.catch( e => reject( e ) )
				}
		);

		return this.promise;

	}

}