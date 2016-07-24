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

		for( let stack in this.properties[this.childProperty] ) {
			let newStack = new Stack( this.properties[this.childProperty][stack], this );
			this.children.push( newStack );
			newStack.element.css( 'z-index', this.properties[this.childProperty].length - stack );
			if( stack > 0 ) {
				newStack.isActive = false;
			}
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