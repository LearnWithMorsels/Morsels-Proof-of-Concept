export class Text extends Card {

    constructor( properties, parent ) {

        super( properties, parent );

        this.view = 'cards/text/text.hbs';

        this.render();

    }

}