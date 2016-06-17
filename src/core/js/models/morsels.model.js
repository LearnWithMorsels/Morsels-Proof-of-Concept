//import * as Handlebars from 'handlebars';
//import * as HandlebarsBinding from 'handlebarsbinding';

let templates = {};

export class MorselsModel {

	/**
	 * The parent object which all courses, sections, cards and activities extend
	 */
	constructor() {
		// console.log( '$', $ );
		// console.log( 'Handlebars', Handlebars );
		// console.log( 'HandlebarsBinding', HandlebarsBinding );
		// HandlebarsBinding.default( Handlebars );

		/**
		 * Is the model complete
		 * @type {boolean}
		 */
		this.isComplete = false;

		/**
		 * The jQuery element of the model
		 * @type {null}
		 */
		this.element = null;

		/**
		 * The template file to use, relative to /app/templates
		 * @type {null}
		 */
		this.template = null;

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

		if( !templates[this.template] ) {
			templates[this.template] = new Promise(
					( resolve, reject ) =>
							fetch( 'views/' + this.template )
									.then( response => response.text() )
									.then( template => Handlebars.compile( template ) )
									.then( html => resolve( html ) )
									.catch( e => reject( e ) )
			);
		}

		return templates[this.template]
				.then( handlebar => handlebar( this.properties ),
						e => console.error( 'Failed to render "' + this.template + '": ', e.message ) );
	}

}