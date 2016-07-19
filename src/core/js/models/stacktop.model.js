import { Card } from './card.model';

export class StackTop extends Card {

    constructor( properties, parent ) {

        super( properties, parent );

        this.element = jQuery( '<div class="morsel-card morsel-stack-top"/>' );
        this.view = 'stack-top.hbs';

        this.render();

    }

}