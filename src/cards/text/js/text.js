//( () => {
//    import {Card} from '../../models/card.model';

    export class Text extends Card {

        constructor( properties, parent ) {

            super();

            this.view = 'cards/text/text.hbs';
            this.parent = parent;
            this.properties = properties;
            this.element = jQuery( '<div class="morsel-card"/>' ).addClass( this.classes );
            super.render();

        }

    }
//} )();