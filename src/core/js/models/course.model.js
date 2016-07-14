import { Morsel } from './morsel.model';
import { Section } from './section.model';

export class Course extends Morsel {

	constructor( parent, language ) {

		super();

		this.parent = parent;
		this.children = [];
		this.ns = 'Course';
		this.element = jQuery( '<div class="morsel-course"/>' );
		this.promise = new Promise( ( resolve, reject ) => {} );
		this.view = 'course.hbs';

		new Promise( ( resolve, reject ) => {
				fetch( 'app/course/' + language + '.json' )
					.then( response => response.json() )
					.then( course => {
						for( let section of course._sections ) {
							this.children.push( new Section( section, this ) );
						}

						this.update();

						return course;
					} )
					.then( course => resolve( course ) )
					.catch( e => reject( e ) )
			}
		);

		this.render();

	}

	addEventListeners() {

		this.eventemitter.on(
			'postRenderSection',
			( section ) => {
				console.log( 'Section rendered (course)', section );
			},
			this
		).on(
			'postRenderCourse',
			( course ) => {
				console.log( 'Course rendered (course)', course );
			},
			this
		);

	}

}