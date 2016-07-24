// import * as Handlebars from 'handlebars';
import { idhandler } from '../tools/idhandler';
import EventEmitter from '../vendor/eventemitter3';

let templates = {};

export class Morsel {

	/**
	 * The parent object which all courses, sections, cards and activities extend
	 */
	constructor() {
		this.children = [];
		this.childrenElementID = idhandler.get();

		this.allChildrenRendered = false;

		/**
		 * The jQuery element of the model
		 * @type {null}
		 */
		this.element = $( '<div/>' );

		this.eventemitter = new EventEmitter();

		/**
		 * Is the model complete
		 * @type {boolean}
		 */
		this.isComplete = false;
		this.isRendered = false;
		this.isStarred = false;

		/**
		 * The template file to use, relative to /app/templates
		 * @type {null}
		 */
		this.view = null;

		this.parent = null;
		
		this.properties = {};

		this.ns = '';

		/**
		 * The properties of the model
		 * @type {{}}
		 */
		this.properties = {};
		
	}
	
	setProperties( properties ) {
		this.properties = properties;
		this.update();
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
			templates[this.view] = new Promise( ( resolve, reject ) =>
				fetch( 'views/' + this.view )
					.then( response => response.text() )
					.then( template => Handlebars.compile( template ) )
					.then( handlebar => resolve( handlebar ) )
					.catch( e => reject( e ) )
			);
		}

		return templates[this.view]
			.then( handlebar => handlebar( this ),
				e => console.error( 'Failed to render "' + this.view + '": ', e.message ) )
			.then( html => this.element.html( html ) )
			.then( () => {
				if( this.children.length ) {
					for( let child in this.children ) {
						let childElement = this.element.find( '[data-childrenid="' + this.childrenElementID + '"]' );

						if( childElement.length &&
								this.children[child].element ) {
							childElement.replaceWith( this.children[child].element );
						} else if( child > 0 ) {
							this.children[child - 1].element.after( this.children[child].element );
						}
					}
				}
			} )
			.then( () => this.isRendered = true )
			.then( () => {
				this.eventemitter.emit( 'postRender' + this.ns, this );
			} );
		
	}

	update() {

		if( templates[this.view] ) {
			return this.render();
		} else {
			console.warn( 'Not rendered yet' );
		}

	}

	checkAllChildrenRendered() {

		if( !this.allChildrenRendered ) {
			let allRendered = true;

			for( let child of this.children ) {
				if( !child.isRendered ) {
					allRendered = false;
					break;
				}
			}

			if( allRendered ) {
				this.allChildrenRendered = true;
				return true;
			}
		}

		return false;

	}

	addEventListeners() {}

}