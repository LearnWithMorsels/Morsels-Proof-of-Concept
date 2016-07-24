import { Morsel } from './morsel.model';
import { Stack } from './stack.model';

export class Course extends Morsel {

	constructor( properties, parent ) {

		super();

		this.parent = parent;
		this.children = [];
		this.childProperty = '_stacks';

		this.properties = properties;

		this.ns = 'Course';

		this.element = jQuery( '<div class="morsel-course"/>' );
		this.view = 'course.hbs';

		for( let stack of this.properties._stacks ) {
			this.children.push( new Stack( stack, this ) );
		}

		this.render();

		this.addEventListeners();

	}

	addEventListeners() {

		this.eventemitter.on(
			'postRenderSection',
			section => {
				console.log( 'Section rendered (course)', section );
			},
			this
		).on(
			'postRenderCourse',
			course => {
				//console.log( 'Course rendered (course)', course );
			},
			this
		);

	}

}