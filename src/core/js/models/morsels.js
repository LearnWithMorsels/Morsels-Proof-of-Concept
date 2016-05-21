import {jquery} from 'jquery';
import * as Handlebars from 'handlebars';

var renderPromise;

export class MorselsModel {

	constructor() {
		//console.log( '$', $ );
		//console.log( 'Handlebars', Handlebars );
		//console.log( 'crossroads', crossroads );

		this.isComplete = false;
		this.element = null;
		this.template = null;
		this.properties = {};
		this.renderPromise = null;
	}

	preRender() {}

	render() {
		this.preRender();

		renderPromise = new Promise( ( resolve, reject ) => {
					fetch( 'templates/' + this.template )
							.then( response => response.text() )
							.then( template => Handlebars.compile( template ) )
							.then( handlebar => handlebar( this.properties ),
									e => console.error( 'Failed to render "' + this.template + '": ', e.message ) )
							//.then( html => this.element.innerHTML = html )
							//.then( html => console.log( this.element, this.template, this.properties ) )
							.then( html => resolve( html ) )
							.catch( e => reject( e ) );
				}
		);

		return renderPromise;
	}

}