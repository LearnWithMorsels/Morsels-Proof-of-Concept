//( () => {
//    import {Card} from '../../models/card.model';

    export class Text extends Card {

        constructor( properties, parent ) {

            super();

            this.view = 'cards/text/text.hbs';
            this.parent = parent;
            this.properties = properties;
            //this.element = jQuery( '<div class="morsel-card"/>' ).addClass( this.classes ).css( 'z-index', 100 - index ).on( 'click', '' );
            this.element = jQuery( '<div class="morsel-card"/>' ).addClass( this.classes );
            this.isRendered = false;
            this.promise = super.render()
                .then( () => this.isRendered = true )
                .then( () => this.parent.element.append( this.element ) )
                .then( () => this.setupDraggable() );

        }

    }
//} )();