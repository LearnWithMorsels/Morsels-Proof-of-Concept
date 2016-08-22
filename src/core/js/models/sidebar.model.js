import { Morsel } from './morsel.model';

export class Sidebar extends Morsel {

	constructor( properties ) {

		super();

		this.properties = properties;

		this.ns = 'Sidebar';

		this.element = jQuery( '#sidebar' );
		this.view = 'sidebar.hbs';

		//this.addLanguageNameHelper();

		this.render();

		//this.addEventTriggers();

	}

	addLanguageNameHelper() {
		//Handlebars.registerHelper( 'languageName', options => this.properties.labels[options] || 'UNKNOWN' );
	}
	
	addEventTriggers() {

		/*this.element.on(
			'click',
			'#language-selector-options [data-language]',
			e => {
				Morsels.eventemitter.emit( 'languageChanged', $( e.target ).attr( 'data-language' ) );
			}
		);*/
	
	}
	
}