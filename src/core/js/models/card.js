import {MorselsModel} from './morsels';
import {elementcreator} from '../tools/elementcreator';

export class CardModel extends MorselsModel {

	constructor( properties, parent ) {
		super();

		this.template = 'cards/' + properties._card + '/' + properties._card + '.hbs';
		this.properties = properties;
		this.parent = parent;
		this.element = elementcreator( 'morsel-card' );

		super.render()
				.then( html => this.element.innerHTML = html )
				.then( () => this.parent.element.appendChild( this.element ) );
	}

}