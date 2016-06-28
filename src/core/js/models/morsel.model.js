// import * as Handlebars from 'handlebars';

let templates = {};

export class Morsel {

	/**
	 * The parent object which all courses, sections, cards and activities extend
	 */
	constructor() {
		this.children = [];

		/**
		 * The jQuery element of the model
		 * @type {null}
		 */
		this.element = $( '<div/>' );

		/**
		 * Is the model complete
		 * @type {boolean}
		 */
		this.isComplete = false;

		this.html = '';

		/**
		 * The template file to use, relative to /app/templates
		 * @type {null}
		 */
		this.template = null;

		this.parent = null;

		/**
		 * The properties of the model
		 * @type {{}}
		 */
		this.properties = {};
	}

	/**
	 * Function to perform before the template renders
	 */
	preRender() {}

	/**
	 * Render the template of the model with the properties
	 * @returns {Promise}
	 */
	render() {
		this.preRender();

		if( !templates[this.view] ) {
			//console.warn( this.view + ' not cached' );
			templates[this.view] = new Promise(
					( resolve, reject ) =>
							fetch( 'views/' + this.view )
									.then( response => response.text() )
									.then( template => Handlebars.compile( template ) )
									.then( handlebar => resolve( handlebar ) )
									.catch( e => reject( e ) )
			);
		} else {
			//console.info( this.view + ' cached' );
		}

		return templates[this.view]
				.then( handlebar => handlebar( this.properties ),
						e => console.error( 'Failed to render "' + this.view + '": ', e.message ) )
				.then( html => this.html = html )
				.then( html => this.element.html( html ) );
	}

}