import {MorselsModel} from './morsels';
import {SectionModel} from './section';

export class Course extends MorselsModel {

	/**
	 * Retrieve the course details
	 * @param strLanguage {string} The language code of the file
	 * @returns {Promise} The promise
	 * @constructor
	 */
	constructor( strLanguage ) {

		super();

		this.element = document.getElementsByTagName( 'morsel-course' )[0];
		this.element = $( '#morsel-course' );

		/**
		 * The promise for retrieving the JSON file
		 * @type {Promise}
		 */
		this.promise = new Promise( ( resolve, reject ) => {
					fetch( 'app/course/' + strLanguage + '.json' )
							.then( response => response.json() )
							.then( course => {
									this.element.html( '' );

									for( var section of course._sections ) {
										var objSection = new SectionModel( section, this );
										this.element.append( objSection.element );
									}

									return course
								} )
							//.then( course => super.render() )
							.then( course => resolve( course ) )
							.catch( e => reject( e ) )
				}
		);

		return this.promise;

	}

}