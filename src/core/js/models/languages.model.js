import { Morsel } from './morsel.model';

export class Languages extends Morsel {

	constructor( properties ) {

		super();

		this.properties = properties;

		this.ns = 'Languages';

		this.element = jQuery( '#language-selector' );
		this.view = 'language-selector.hbs';

		this.addLanguageNameHelper();

		this.render();

		console.log( Morsels );

		this.addEventTriggers();

		console.log( this.properties );

	}

	addLanguageNameHelper() {
		Handlebars.registerHelper( 'languageName', options => this.properties.labels[options] || 'UNKNOWN' );
	}
	
	addEventTriggers() {

		this.element.on(
			'click',
			'#language-selector-options [data-language]',
			e => {
				Morsels.eventemitter.emit( 'languageChanged', $( e.target ).attr( 'data-language' ) );
			}
		);
	
	}

	addEventListeners() {}
	
}