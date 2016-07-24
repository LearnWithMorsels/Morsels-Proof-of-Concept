import { Morsel } from './morsel.model';

export class Activity extends Morsel {

	constructor( properties, parent ) {

		super();

		this.properties = properties;
		this.parent = parent;
		this.ns = 'Activity';
		this.element = jQuery( '<div class="morsel-activity"/>' );

		this.addEventListeners();

		return this;

	}

	addEventListeners() {

		/*this.element.on( 'click', '.toggle-starred', () => {
			this.isStarred = !this.isStarred;
			this.update();
		} );*/

		this.eventemitter.on(
			'postRenderActivity',
			( card ) => {
				//console.log( 'Activity rendered (activity)', card );
				this.parent.update();
			},
			this
		);

	}

}