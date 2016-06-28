import {Section} from './section.model';

export class Course {

	constructor( parent, language ) {

		this.element = jQuery( '<div class="morsel-course"/>' );
		this.children = [];
		this.parent = parent;

		this.parent.element.replaceWith( this.element );

		this.addEventListeners();

		return new Promise( ( resolve, reject ) => {
					fetch( 'app/course/' + language + '.json' )
							.then( response => response.json() )
							.then( course => this.properites = course )
							.then( course => {
								this.element.html( '' );

								for( let section of course._sections ) {
									this.children.push( new Section( section, this ) );
								}

								eventemitter.emit( 'appReady', this, course );

								return course;
							} )
							.then( course => resolve( course ) )
							.catch( e => reject( e ) )
				}
		);

	}

	addEventListeners() {

		eventemitter.on(
			'sectionAdded',
			function( alpha ) {
				//console.log( 'Section added', this, alpha );
			},
			this
		);

	}

}