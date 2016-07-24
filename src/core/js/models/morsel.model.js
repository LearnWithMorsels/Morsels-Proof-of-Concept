// import * as Handlebars from 'handlebars';
import { idhandler } from '../tools/idhandler';
import EventEmitter from '../vendor/eventemitter3';

let templates = {};

export class Morsel {

	/**
	 * The parent object which all courses, stacks, cards and activities extend
	 */
	constructor() {
		/**
		 * The parent object
		 * @type {App,Course,Stack,Card,Activity}
		 */
		this.parent = null;

		/**
		 * The children of the object
		 * @type {Array}
		 */
		this.children = [];

		/**
		 * The child property in the course JSON file
		 * @type {string}
		 */
		this.childrenProperty = '_children';

		/**
		 * A unique ID to use for the rendering of the children elements
		 * @type {string}
		 */
		this.childrenElementID = idhandler.get();

		/**
		 * If true, all the children elements have been rendered
		 * @type {boolean}
		 */
		this.allChildrenRendered = false;

		/**
		 * The properties of the model which contains all of the content and children
		 * @type {{}}
		 */
		this.properties = {};

		/**
		 * The namespace of the events (Capitalised)
		 * @type {string}
		 */
		this.ns = '';

		/**
		 * The eventemmiter object for this object
		 */
		this.eventemitter = new EventEmitter();

		/**
		 * The jQuery element of the model
		 * @type {null}
		 */
		this.element = $( '<div/>' );

		/**
		 * The template file to use, relative to /app/templates
		 * @type {null}
		 */
		this.view = null;

		/**
		 * If TRUE, the object model has been set to "complete"
		 * @type {boolean}
		 */
		this.isComplete = false;

		/**
		 * If TRUE, the object view has been rendered
		 * @type {boolean}
		 */
		this.isRendered = false;

		/**
		 * If TRUE, the object view has been starred
		 * @type {boolean}
		 */
		this.isStarred = false;
		
	}

	setProperties( properties ) {

		this.properties = properties;
		this.update();

		if( this.childProperty ) {
			for( let child in this.properties[this.childProperty] ) {
				if( this.children[child] &&
						this.children[child].setProperties ) {
					this.children[child].setProperties( this.properties[this.childProperty][child] );
				}
			}
		}

		this.update();

	}

	/**
	 * Render the template of the model with the properties
	 * @returns {Promise}
	 */
	render() {

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
			console.log( this.children.length, this.properties[this.childProperty].length );
			if( this.children.length === this.properties[this.childProperty].length ) {
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
		}

		return false;

	}

	addEventListeners() {}

}