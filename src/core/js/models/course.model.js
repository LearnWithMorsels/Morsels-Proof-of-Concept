import {Section} from './section.model';

export class Course {

	constructor( parent, language ) {

		this.element = jQuery( '<div class="morsel-course"/>' );
		this.children = [];
		this.parent = parent;

		this.parent.element.replaceWith( this.element );

		return new Promise( ( resolve, reject ) => {
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

	}

}